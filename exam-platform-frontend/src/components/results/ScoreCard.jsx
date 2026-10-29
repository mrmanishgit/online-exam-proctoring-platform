import { Card, CardContent, Stack, Typography } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

export default function ScoreCard({ score, maxScore, percentage, label = "Your score", grade, status }) {
  const calculated = percentage ?? (Number(maxScore) > 0 ? (Number(score || 0) / Number(maxScore)) * 100 : null);
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <EmojiEventsOutlinedIcon color="primary" sx={{ fontSize: 38 }} />
          <div>
            <Typography color="text.secondary" variant="body2">{label}</Typography>
            <Typography variant="h4" fontWeight={800}>
              {score == null ? "—" : `${score}${maxScore == null ? "" : ` / ${maxScore}`}`}
            </Typography>
          </div>
        </Stack>
        {calculated != null && <Typography sx={{ mt: 2 }} fontWeight={600}>{Number(calculated).toFixed(1)}%</Typography>}
        {grade && <Typography color="text.secondary">Grade: {grade}</Typography>}
        {status && <Typography color="text.secondary">Status: {status}</Typography>}
      </CardContent>
    </Card>
  );
}
