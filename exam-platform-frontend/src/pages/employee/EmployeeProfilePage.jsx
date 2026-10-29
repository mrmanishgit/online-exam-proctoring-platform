import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";

export default function EmployeeProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    department: user?.department ?? "",
    employeeId: user?.employeeId ?? "",
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
    // Connect to the employee profile update API.
    setSaved(true);
  };

  return (
    <Box>
      <PageHeader
        title="Employee Profile"
        subtitle="Manage your employee account information."
      />

      {saved && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Profile changes are currently local to this page. Connect the profile
          update API to save them permanently.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: 34,
                }}
              >
                {form.name?.charAt(0)?.toUpperCase() || "E"}
              </Avatar>

              <Typography variant="h6" fontWeight={700}>
                {form.name || "Employee"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {form.email || "No email available"}
              </Typography>

              <Typography variant="body2" mt={2}>
                Employee ID: {form.employeeId || "Not assigned"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Account Information
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full name"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email address"
                      type="email"
                      name="email"
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
                      label="Department"
                      name="department"
                      value={form.department}
                      onChange={updateField}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      name="employeeId"
                      value={form.employeeId}
                      onChange={updateField}
                      disabled
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={2}>
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
                            name: user?.name ?? "",
                            email: user?.email ?? "",
                            phone: user?.phone ?? "",
                            department: user?.department ?? "",
                            employeeId: user?.employeeId ?? "",
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