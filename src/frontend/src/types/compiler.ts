export interface CompileRequest {
  language: string;
  code: string;
  stdin?: string;
  flags?: string[];
}

export interface CompileResult {
  stdout: string;
  stderr: string;
  status: number;
  timing?: number;
}

export interface Diagnostic {
  message: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
}
