import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";

const demoUsers = [
  {
    id: "USR-1001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    role: "STUDENT",
    status: "Active",
  },
  {
    id: "USR-1002",
    name: "Priya Das",
    email: "priya@example.com",
    role: "STUDENT",
    status: "Active",
  },
  {
    id: "USR-1003",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    role: "EMPLOYEE",
    status: "Active",
  },
  {
    id: "USR-1004",
    name: "Sneha Patel",
    email: "sneha@example.com",
    role: "STUDENT",
    status: "Inactive",
  },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const users = useMemo(
    () =>
      demoUsers.filter((user) => {
        const matchesSearch = `${user.name} ${user.email} ${user.id}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return (
          matchesSearch &&
          (roleFilter === "All" || user.role === roleFilter)
        );
      }),
    [search, roleFilter],
  );

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="View candidate and employee accounts."
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Outlined />}
            onClick={() =>
              window.alert("Connect this action to the user creation API.")
            }
          >
            Add User
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        This screen currently displays sample users. Connect the user management
        API before using it for real account administration.
      </Alert>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email, or user ID..."
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
                    {user.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {user.id}
                  </Typography>
                </Box>

                <Chip
                  label={user.role}
                  color={user.role === "ADMIN" ? "secondary" : "primary"}
                  variant="outlined"
                />

                <Chip
                  label={user.status}
                  color={user.status === "Active" ? "success" : "default"}
                />

                <Button
                  variant="outlined"
                  onClick={() =>
                    window.alert("Connect this action to the user details API.")
                  }
                >
                  View Details
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <EmptyState
            title="No users found"
            description="Try changing the search term or role filter."
          />
        )}
      </Stack>
    </Box>
  );
}