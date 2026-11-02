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
import userApi from "../../api/userApi";

export default function EmployeeProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? user?.name?.split(" ")[0] ?? "",
    lastName: user?.lastName ?? user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    department: user?.department ?? "",
    employeeId: user?.employeeId ?? "",
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try { const response = await userApi.updateCurrentUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone }); const updated = response?.data ?? response; updateUser(updated); setForm(old => ({...old, firstName: updated.firstName ?? old.firstName, lastName: updated.lastName ?? old.lastName, phone: updated.phone ?? old.phone})); setSaved(true); }
    catch (err) { setError(err?.response?.data?.message || "Profile could not be saved."); } finally { setSaving(false); }
  };

  return (
    <Box>
      <PageHeader
        title="Employee Profile"
        subtitle="Manage your employee account information."
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {saved && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your profile changes have been saved to your account.
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
                {form.firstName?.charAt(0)?.toUpperCase() || "E"}
              </Avatar>

              <Typography variant="h6" fontWeight={700}>
                {[form.firstName, form.lastName].filter(Boolean).join(" ") || "Employee"}
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
                      name="firstName"
                      value={form.firstName}
                      onChange={updateField}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Last name" name="lastName" value={form.lastName} onChange={updateField} />
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
                      InputProps={{ readOnly: true }}
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

                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        type="submit"
                        disabled={saving}
                        variant="contained"
                        startIcon={<SaveOutlined />}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => {
                          setForm({
                            firstName: user?.firstName ?? user?.name?.split(" ")[0] ?? "",
    lastName: user?.lastName ?? user?.name?.split(" ").slice(1).join(" ") ?? "",
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