package com.examplatform.service.impl;

import com.examplatform.dto.auth.*;
import com.examplatform.dto.user.UserResponse;
import com.examplatform.entity.*;
import com.examplatform.enums.Role;
import com.examplatform.repository.*;
import com.examplatform.security.JwtService;
import com.examplatform.service.AuthService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final EmailVerificationTokenRepository verificationTokens;
    private final PasswordResetTokenRepository resetTokens;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final JavaMailSender mail;
    @Value("${spring.mail.username:}") private String mailFrom;
    @Value("${app.auth.require-email-verification:false}") private boolean requireVerification;

    public AuthServiceImpl(UserRepository users, RefreshTokenRepository refreshTokens,
            EmailVerificationTokenRepository verificationTokens, PasswordResetTokenRepository resetTokens,
            AuthenticationManager authenticationManager, PasswordEncoder encoder, JwtService jwt,
            JavaMailSender mail) {
        this.users=users; this.refreshTokens=refreshTokens; this.verificationTokens=verificationTokens;
        this.resetTokens=resetTokens; this.authenticationManager=authenticationManager;
        this.encoder=encoder; this.jwt=jwt; this.mail=mail;
    }

    @Override public AuthResponse register(RegisterRequest r) {
        if (users.existsByEmailIgnoreCase(r.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        User u=new User(); u.setFirstName(r.getFirstName().trim()); u.setLastName(r.getLastName().trim());
        u.setEmail(r.getEmail().trim().toLowerCase()); u.setPhone(r.getPhone());
        u.setPassword(encoder.encode(r.getPassword())); u.setRole(Role.STUDENT);
        u.setEnabled(true); u.setEmailVerified(false); u=users.save(u);
        issueVerification(u);
        return tokensFor(u);
    }

    @Override public AuthResponse login(LoginRequest r) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(r.getEmail().trim().toLowerCase(), r.getPassword()));
        User u=users.findByEmailIgnoreCase(r.getEmail()).orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!Boolean.TRUE.equals(u.getEnabled())) throw new DisabledException("Account is disabled");
        if (requireVerification && !Boolean.TRUE.equals(u.getEmailVerified()))
            throw new DisabledException("Please verify your email before logging in");
        return tokensFor(u);
    }

    private AuthResponse tokensFor(User u) {
        UserDetails principal=org.springframework.security.core.userdetails.User.withUsername(u.getEmail())
                .password(u.getPassword()).authorities("ROLE_"+u.getRole().name()).build();
        String access=jwt.generateAccessToken(principal), refresh=jwt.generateRefreshToken(principal);
        RefreshToken rt=new RefreshToken(); rt.setUser(u); rt.setToken(refresh);
        rt.setExpiresAt(Instant.now().plusMillis(jwt.getRefreshTokenExpirationMs())); refreshTokens.save(rt);
        return AuthResponse.builder().accessToken(access).refreshToken(refresh).tokenType("Bearer")
                .expiresIn(jwt.getAccessTokenExpirationMs()/1000).user(toResponse(u)).build();
    }

    @Override public AuthResponse refresh(RefreshTokenRequest r) {
        RefreshToken stored=refreshTokens.findByToken(r.getRefreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid refresh token"));
        if (stored.getRevokedAt()!=null || stored.getExpiresAt().isBefore(Instant.now()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Refresh token expired or revoked");
        String email=jwt.extractUsername(r.getRefreshToken());
        if (!"REFRESH".equals(jwt.extractTokenType(r.getRefreshToken())))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid token type");
        User u=users.findByEmailIgnoreCase(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        stored.setRevokedAt(Instant.now()); refreshTokens.save(stored);
        return tokensFor(u);
    }

    @Override public void logout(String token) {
        if (token==null || token.isBlank()) return;
        refreshTokens.findByToken(token).ifPresent(t->{t.setRevokedAt(Instant.now()); refreshTokens.save(t);});
    }

    @Override public void verifyEmail(String token) {
        EmailVerificationToken t=verificationTokens.findByToken(token)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid verification token"));
        if(t.getUsedAt()!=null || t.getExpiresAt().isBefore(Instant.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Verification token expired or already used");
        t.getUser().setEmailVerified(true); t.setUsedAt(Instant.now());
        users.save(t.getUser()); verificationTokens.save(t);
    }

    @Override public void resendVerification(String email) {
        users.findByEmailIgnoreCase(email).filter(u->!Boolean.TRUE.equals(u.getEmailVerified())).ifPresent(this::issueVerification);
    }

    private void issueVerification(User u) {
        String token=UUID.randomUUID().toString();
        EmailVerificationToken t=new EmailVerificationToken(); t.setUser(u); t.setToken(token);
        t.setExpiresAt(Instant.now().plusSeconds(86400)); verificationTokens.save(t);
        sendMail(u.getEmail(),"Verify your email","Your verification token is: "+token);
    }

    @Override public void forgotPassword(String email) {
        users.findByEmailIgnoreCase(email).ifPresent(u->{
            String token=UUID.randomUUID().toString(); PasswordResetToken t=new PasswordResetToken();
            t.setUser(u); t.setToken(token); t.setExpiresAt(Instant.now().plusSeconds(3600)); resetTokens.save(t);
            sendMail(u.getEmail(),"Password reset","Your password reset token is: "+token);
        });
    }

    @Override public void resetPassword(ResetPasswordRequest r) {
        PasswordResetToken t=resetTokens.findByToken(r.getToken())
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid reset token"));
        if(t.getUsedAt()!=null || t.getExpiresAt().isBefore(Instant.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Reset token expired or already used");
        t.getUser().setPassword(encoder.encode(r.getNewPassword())); t.setUsedAt(Instant.now());
        users.save(t.getUser()); resetTokens.save(t); refreshTokens.deleteByUserId(t.getUser().getId());
    }

    @Override @Transactional(readOnly=true) public UserResponse currentUser(String email) {
        return users.findByEmailIgnoreCase(email).map(this::toResponse)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
    }

    @Override @Transactional
    public UserResponse updateProfile(String email, com.examplatform.dto.user.UpdateProfileRequest request) {
        User u = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        u.setFirstName(request.getFirstName().trim());
        u.setLastName(request.getLastName() == null ? "" : request.getLastName().trim());
        u.setPhone(request.getPhone() == null ? null : request.getPhone().trim());
        u.setUpdatedAt(Instant.now());
        return toResponse(users.save(u));
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder().id(u.getId()).firstName(u.getFirstName()).lastName(u.getLastName())
                .email(u.getEmail()).phone(u.getPhone()).role(u.getRole().name()).enabled(u.getEnabled())
                .emailVerified(u.getEmailVerified()).createdAt(u.getCreatedAt()).updatedAt(u.getUpdatedAt()).build();
    }

    private void sendMail(String to,String subject,String body) {
        if(mailFrom==null || mailFrom.isBlank()) return; // configure SMTP to enable delivery
        try { MimeMessage m=mail.createMimeMessage(); MimeMessageHelper h=new MimeMessageHelper(m,false,"UTF-8");
            h.setFrom(mailFrom); h.setTo(to); h.setSubject(subject); h.setText(body); mail.send(m);
        } catch (MessagingException ex) { throw new IllegalStateException("Could not send email",ex); }
    }
}
