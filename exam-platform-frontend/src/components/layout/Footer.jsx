import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box component="footer" bgcolor="background.paper" mt="auto">
      <Divider />

      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
          py={3}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ExamPilot. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography
              component={Link}
              to="/privacy"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Privacy
            </Typography>

            <Typography
              component={Link}
              to="/terms"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Terms
            </Typography>

            <Typography
              component={Link}
              to="/contact"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
            >
              Contact
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}