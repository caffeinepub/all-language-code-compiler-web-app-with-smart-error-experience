import type { Diagnostic } from '@/types/compiler';

/**
 * Parse stderr text into structured diagnostics with line/column information.
 * Uses heuristics to extract error/warning patterns from various compilers.
 */
export function parseDiagnostics(stderr: string): Diagnostic[] {
  if (!stderr || !stderr.trim()) {
    return [];
  }

  const diagnostics: Diagnostic[] = [];
  const lines = stderr.split('\n');

  // Common patterns for different compilers:
  // Python: File "file.py", line 12, in <module>
  // JavaScript: file.js:12:5 - error TS2304
  // Rust: error[E0425]: cannot find value `x` in this scope --> src/main.rs:2:5
  // C++: file.cpp:12:5: error: 'x' was not declared in this scope
  // Java: Main.java:12: error: cannot find symbol

  const patterns = [
    // Pattern: file:line:column: severity: message
    /^(?:.*?):(\d+):(\d+):\s*(error|warning|note):\s*(.+)$/i,
    // Pattern: file:line: severity: message
    /^(?:.*?):(\d+):\s*(error|warning|note):\s*(.+)$/i,
    // Pattern: line line, column column
    /line\s+(\d+)(?:,\s*column\s+(\d+))?/i,
    // Pattern: at line line
    /at\s+line\s+(\d+)/i,
    // Pattern: (line, column)
    /\((\d+),\s*(\d+)\)/,
  ];

  let currentDiagnostic: Partial<Diagnostic> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    let matched = false;

    // Try each pattern
    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        matched = true;

        // Save previous diagnostic if exists
        if (currentDiagnostic && currentDiagnostic.message) {
          diagnostics.push(currentDiagnostic as Diagnostic);
        }

        // Determine severity
        let severity: Diagnostic['severity'] = 'error';
        const severityMatch = trimmedLine.match(/\b(error|warning|note|info)\b/i);
        if (severityMatch) {
          const sev = severityMatch[1].toLowerCase();
          if (sev === 'warning') severity = 'warning';
          else if (sev === 'note' || sev === 'info') severity = 'info';
        }

        // Extract line and column
        const lineNum = match[1] ? parseInt(match[1], 10) : undefined;
        const colNum = match[2] ? parseInt(match[2], 10) : undefined;

        // Extract message (varies by pattern)
        let message = '';
        if (match.length > 4) {
          message = match[4] || match[3] || trimmedLine;
        } else if (match.length > 3) {
          message = match[3] || trimmedLine;
        } else {
          message = trimmedLine;
        }

        currentDiagnostic = {
          message: message.trim(),
          severity,
          line: lineNum,
          column: colNum,
        };

        break;
      }
    }

    // If no pattern matched but we have a current diagnostic, append as continuation
    if (!matched && currentDiagnostic) {
      currentDiagnostic.message += ' ' + trimmedLine;
    } else if (!matched && trimmedLine.length > 0) {
      // Start a new unlocated diagnostic
      if (currentDiagnostic && currentDiagnostic.message) {
        diagnostics.push(currentDiagnostic as Diagnostic);
      }

      const severity: Diagnostic['severity'] = 
        /\berror\b/i.test(trimmedLine) ? 'error' :
        /\bwarning\b/i.test(trimmedLine) ? 'warning' : 'info';

      currentDiagnostic = {
        message: trimmedLine,
        severity,
      };
    }
  }

  // Add final diagnostic
  if (currentDiagnostic && currentDiagnostic.message) {
    diagnostics.push(currentDiagnostic as Diagnostic);
  }

  // If no diagnostics were parsed, create a single unlocated one
  if (diagnostics.length === 0) {
    diagnostics.push({
      message: stderr.trim(),
      severity: 'error',
    });
  }

  return diagnostics;
}
