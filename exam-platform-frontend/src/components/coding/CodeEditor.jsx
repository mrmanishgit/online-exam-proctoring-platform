import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

const DEFAULT_CODE = {
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  javascript: `function main() {
  console.log("Hello, World!");
}

main();`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
};

export default function CodeEditor({
  value,
  onChange,
  language = "java",
  readOnly = false,
  height = 420,
  fontSize = 14,
}) {
  const [code, setCode] = useState(
    value ?? DEFAULT_CODE[language] ?? ""
  );

  useEffect(() => {
    setCode(value ?? DEFAULT_CODE[language] ?? "");
  }, [value, language]);

  const handleChange = (event) => {
    const nextCode = event.target.value;
    setCode(nextCode);
    onChange?.(nextCode);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "#111827",
        color: "#e5e7eb",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: "#1f2937",
          borderBottom: "1px solid #374151",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "#d1d5db" }}>
          {language.toUpperCase()} EDITOR
        </Typography>
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          {readOnly ? "Read only" : "Editable"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", height }}>
        <Box
          aria-hidden="true"
          sx={{
            px: 1.5,
            py: 1.5,
            color: "#6b7280",
            bgcolor: "#111827",
            textAlign: "right",
            userSelect: "none",
            fontFamily: "monospace",
            fontSize,
            lineHeight: 1.65,
            overflow: "hidden",
          }}
        >
          {Array.from(
            { length: Math.max(1, code.split("\n").length) },
            (_, index) => (
              <Box key={index}>{index + 1}</Box>
            )
          )}
        </Box>

        <Box
          component="textarea"
          aria-label="Source code editor"
          spellCheck={false}
          value={code}
          readOnly={readOnly}
          onChange={handleChange}
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            resize: "none",
            outline: "none",
            border: 0,
            p: 1.5,
            bgcolor: "#111827",
            color: "#e5e7eb",
            fontFamily: '"Fira Code", Consolas, monospace',
            fontSize,
            lineHeight: 1.65,
            whiteSpace: "pre",
            overflow: "auto",
            tabSize: 4,
            "&:focus": { outline: "none" },
          }}
        />
      </Box>
    </Paper>
  );
}