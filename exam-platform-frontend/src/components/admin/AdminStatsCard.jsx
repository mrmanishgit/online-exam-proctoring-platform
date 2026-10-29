import {
  Avatar,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

export default function AdminStatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary.main",
  trend,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ overflowWrap: "anywhere" }}
            >
              {value ?? 0}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}

            {trend !== undefined && trend !== null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <TrendingUpRoundedIcon
                  fontSize="small"
                  color="success"
                />
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: color,
              color: "#fff",
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}