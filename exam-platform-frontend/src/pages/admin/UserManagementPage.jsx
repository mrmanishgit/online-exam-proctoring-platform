import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import userApi from "../../api/userApi";
import { unwrapList } from "../../utils/apiResponse";

export default function UserManagementPage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", role: "EMPLOYEE" });

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await userApi.getUsers();
      setRecords(unwrapList(response));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load users. Check backend authorization and the /api/users endpoint."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const users = useMemo(() => {
    return records.filter((user) => {
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.name ||
        "";
      const searchableText = `${name} ${user.email || ""} ${user.id || ""}`;
      const matchesSearch = searchableText
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "All" ||
        String(user.role || "").toUpperCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [records, search, roleFilter]);

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="User accounts loaded from the backend."
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => setCreateOpen(true)}>Create Admin / Employee</Button>
            <Button variant="outlined" onClick={load} disabled={loading}>Refresh</Button>
          </Stack>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email, or ID..."
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {["All", "STUDENT", "EMPLOYEE", "ADMIN"].map((role) => (
                <Chip
                  key={role}
                  label={role === "All" ? "All roles" : role}
                  clickable
                  color={roleFilter === role ? "primary" : "default"}
                  variant={roleFilter === role ? "filled" : "outlined"}
                  onClick={() => setRoleFilter(role)}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users returned"
          description="The backend returned no matching user records."
        />
      ) : (
        <Stack spacing={2}>
          {users.map((user) => (
            <Card key={user.id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {[
                        user.firstName,
                        user.lastName,
                      ].filter(Boolean).join(" ") || user.name || "Unnamed user"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email || "No email"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id ?? "—"}
                    </Typography>
                  </Box>

                  <Chip
                    label={user.role || "UNKNOWN"}
                    color={
                      String(user.role).toUpperCase() === "ADMIN"
                        ? "secondary"
                        : "primary"
                    }
                    variant="outlined"
                  />
                  <Chip
                    label={user.enabled === false ? "Disabled" : "Enabled"}
                    color={user.enabled === false ? "default" : "success"}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create administrator or employee</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "12px !important" }}>
          <TextField label="First name" value={newUser.firstName} onChange={e=>setNewUser(v=>({...v,firstName:e.target.value}))} required />
          <TextField label="Last name" value={newUser.lastName} onChange={e=>setNewUser(v=>({...v,lastName:e.target.value}))} />
          <TextField label="Email" type="email" value={newUser.email} onChange={e=>setNewUser(v=>({...v,email:e.target.value}))} required />
          <TextField label="Temporary password (min 10 characters)" type="password" value={newUser.password} onChange={e=>setNewUser(v=>({...v,password:e.target.value}))} required />
          <TextField label="Phone" value={newUser.phone} onChange={e=>setNewUser(v=>({...v,phone:e.target.value}))} />
          <TextField select label="Role" value={newUser.role} onChange={e=>setNewUser(v=>({...v,role:e.target.value}))}>
            <MenuItem value="EMPLOYEE">Employee</MenuItem><MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setCreateOpen(false)}>Cancel</Button>
          <Button disabled={creating || !newUser.firstName.trim() || !newUser.email.trim() || newUser.password.length<10} variant="contained" onClick={async()=>{setCreating(true);setError("");try{await userApi.createUser(newUser);setCreateOpen(false);setNewUser({firstName:"",lastName:"",email:"",password:"",phone:"",role:"EMPLOYEE"});await load();}catch(err){setError(err?.response?.data?.message || "Could not create account. Check ADMIN permission and request fields.");}finally{setCreating(false);}}}>{creating?"Creating...":"Create account"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
