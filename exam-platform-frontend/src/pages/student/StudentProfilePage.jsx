import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
//import { SaveOutlined, PersonOutline } from "@mui/icons-material";
import { SaveOutlined, AccountCircle } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";

export default function StudentProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? user?.name?.split(" ")[0] ?? "",
    lastName: user?.lastName ?? user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    college: user?.college ?? "",
    department: user?.department ?? "",
  });

  const [saved, setSaved] = useState(false);

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect this handler to the profile update API.
    setSaved(true);
  };

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your student account details."
      />

      {saved && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Changes are currently held in this page only. Connect the profile
          update API to save them permanently.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: "auto",
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: 36,
                      }}
                    >
                      {form.firstName?.charAt(0)?.toUpperCase() || (
                        <AccountCircle fontSize="large" />
                      )}
                    </Avatar>

              <Typography variant="h6" fontWeight={700}>
                {[form.firstName, form.lastName].filter(Boolean).join(" ") ||
                  "Student"}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {form.email || "No email available"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Account type
              </Typography>
              <Typography fontWeight={600} mt={0.5}>
                Student
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Personal information
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First name"
                      name="firstName"
                      value={form.firstName}
                      onChange={updateField}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last name"
                      name="lastName"
                      value={form.lastName}
                      onChange={updateField}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Email address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateField}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone number"
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="College / Institution"
                      name="college"
                      value={form.college}
                      onChange={updateField}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={form.department}
                      onChange={updateField}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveOutlined />}
                      >
                        Save Changes
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => {
                          setForm({
                            firstName:
                              user?.firstName ??
                              user?.name?.split(" ")[0] ??
                              "",
                            lastName:
                              user?.lastName ??
                              user?.name?.split(" ").slice(1).join(" ") ??
                              "",
                            email: user?.email ?? "",
                            phone: user?.phone ?? "",
                            college: user?.college ?? "",
                            department: user?.department ?? "",
                          });
                          setSaved(false);
                        }}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}