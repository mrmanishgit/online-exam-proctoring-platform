import { Alert, Box, Button, Checkbox, FormControlLabel, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { useState } from "react";

const defaultInstructions = [
  "Read each question carefully before answering.",
  "Your remaining time is displayed during the exam.",
  "Your answers may be saved automatically when autosave is enabled.",
  "Do not refresh or close the exam window unless instructed.",
  "Submit the exam when you have finished reviewing your answers.",
];

export default function ExamInstructions({ instructions = defaultInstructions, onContinue, onCancel, requireAcknowledgement = true }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Exam instructions</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>Please review these instructions before starting.</Alert>
      <List dense>
        {instructions.map((instruction, index) => (
          <ListItem key={`${index}-${instruction}`} disableGutters>
            <ListItemText primary={`${index + 1}. ${instruction}`} />
          </ListItem>
        ))}
      </List>
      {requireAcknowledgement && (
        <FormControlLabel
          control={<Checkbox checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} />}
          label="I have read and understood the exam instructions."
        />
      )}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button variant="contained" onClick={onContinue} disabled={requireAcknowledgement && !acknowledged}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
}
