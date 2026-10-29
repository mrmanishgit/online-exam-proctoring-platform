import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

export default function CertificatePreview({ candidateName = "Candidate", examTitle = "Exam", issuedDate, certificateId, onDownload, eligible = true }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, textAlign: "center", borderStyle: "double", borderWidth: 3 }}>
      <WorkspacePremiumOutlinedIcon color="primary" sx={{ fontSize: 52 }} />
      <Typography variant="overline" color="text.secondary">Certificate preview</Typography>
      <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>Certificate of Achievement</Typography>
      <Typography color="text.secondary">This certifies that</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ my: 1 }}>{candidateName}</Typography>
      <Typography color="text.secondary">has completed</Typography>
      <Typography variant="h6" fontWeight={600} sx={{ my: 1 }}>{examTitle}</Typography>
      {issuedDate && <Typography variant="body2">Issued: {issuedDate}</Typography>}
      {certificateId && <Typography variant="caption" display="block" sx={{ mt: 1 }}>Certificate ID: {certificateId}</Typography>}
      {!eligible && <Typography color="error" sx={{ mt: 2 }}>A certificate is not available for this result.</Typography>}
      {onDownload && <Button sx={{ mt: 2 }} variant="contained" onClick={onDownload} disabled={!eligible}>Download certificate</Button>}
    </Paper>
  );
}
