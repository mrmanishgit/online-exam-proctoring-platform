import { Box, Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  action,
}) {
  return (
    <Box mb={4}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) =>
            item.path && index !== breadcrumbs.length - 1 ? (
              <Link
                key={`${item.label}-${index}`}
                component={RouterLink}
                to={item.path}
                underline="hover"
                color="inherit"
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={`${item.label}-${index}`} color="text.primary">
                {item.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>

          {subtitle && (
            <Typography color="text.secondary" mt={1}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {action}
      </Stack>
    </Box>
  );
}