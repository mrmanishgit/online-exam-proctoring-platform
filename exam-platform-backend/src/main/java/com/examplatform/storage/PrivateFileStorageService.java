package com.examplatform.storage;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import org.springframework.web.multipart.MultipartFile; import java.io.IOException; import java.nio.file.*; import java.util.Set; import java.util.UUID;
@Service public class PrivateFileStorageService {
 private static final Set<String> ALLOWED=Set.of("image/jpeg","image/png","application/pdf");
 private final Path root; private final long maxBytes;
 public PrivateFileStorageService(@Value("${app.storage.root:./private-uploads}") String root,@Value("${app.storage.max-bytes:10485760}") long maxBytes){this.root=Paths.get(root).toAbsolutePath().normalize();this.maxBytes=maxBytes;}
 public StoredFile store(MultipartFile file) {try {if(file==null||file.isEmpty())throw new IllegalArgumentException("File is empty"); if(file.getSize()>maxBytes)throw new IllegalArgumentException("File exceeds size limit"); String type=file.getContentType(); if(type==null||!ALLOWED.contains(type))throw new IllegalArgumentException("Unsupported content type"); byte[] bytes=file.getBytes(); if(!signatureMatches(type,bytes))throw new IllegalArgumentException("File signature does not match content type"); Files.createDirectories(root); String key=UUID.randomUUID().toString(); String ext=switch(type){case "image/jpeg"->".jpg";case "image/png"->".png";default->".pdf";}; Files.write(root.resolve(key+ext),bytes,StandardOpenOption.CREATE_NEW); return new StoredFile(key+ext,type,bytes.length);}catch(IOException e){throw new IllegalStateException("Unable to store file",e);}}
 private boolean signatureMatches(String type,byte[] b){if(b.length<8)return false; if(type.equals("image/jpeg"))return (b[0]&255)==255&&(b[1]&255)==216; if(type.equals("image/png"))return (b[0]&255)==137&&b[1]==80&&b[2]==78&&b[3]==71; return b[0]=='%'&&b[1]=='P'&&b[2]=='D'&&b[3]=='F';}
 public record StoredFile(String storageKey,String contentType,long size){}
}
