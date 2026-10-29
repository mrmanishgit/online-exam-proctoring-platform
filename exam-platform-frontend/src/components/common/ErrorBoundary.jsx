import { Component } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application rendering error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={3}
          bgcolor="background.default"
        >
          <Stack spacing={2} maxWidth={480} width="100%">
            <Typography variant="h4" fontWeight={800}>
              Something went wrong
            </Typography>

            <Alert severity="error">
              ExamPilot encountered an unexpected error. Reload the page to
              try again.
            </Alert>

            <Button
              variant="contained"
              onClick={this.handleReload}
              fullWidth
            >
              Reload application
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}