import { ScrollArea } from '@/components/ui/scroll-area';
import type { Diagnostic } from '@/types/compiler';

interface CodeFrameProps {
  diagnostic: Diagnostic;
  code: string;
}

export function CodeFrame({ diagnostic, code }: CodeFrameProps) {
  const lines = code.split('\n');
  const { line, column } = diagnostic;

  if (line === undefined) {
    return (
      <div className="rounded-md border bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to locate error in source code. Line information not available.
        </p>
      </div>
    );
  }

  // Show context: 2 lines before and after
  const startLine = Math.max(0, line - 3);
  const endLine = Math.min(lines.length - 1, line + 2);
  const contextLines = lines.slice(startLine, endLine + 1);

  return (
    <ScrollArea className="h-[200px] rounded-md border bg-muted/30">
      <div className="p-4 font-mono text-sm">
        {contextLines.map((lineContent, index) => {
          const lineNumber = startLine + index + 1;
          const isErrorLine = lineNumber === line;

          return (
            <div key={lineNumber}>
              <div
                className={`flex ${
                  isErrorLine
                    ? 'bg-destructive/10 dark:bg-destructive/20 border-l-2 border-destructive'
                    : ''
                }`}
              >
                <span
                  className={`inline-block w-12 text-right pr-4 select-none ${
                    isErrorLine
                      ? 'text-destructive font-bold'
                      : 'text-muted-foreground'
                  }`}
                >
                  {lineNumber}
                </span>
                <span className={`flex-1 ${isErrorLine ? 'font-semibold' : ''}`}>
                  {lineContent || ' '}
                </span>
              </div>
              {isErrorLine && column !== undefined && (
                <div className="flex">
                  <span className="inline-block w-12" />
                  <span className="text-destructive">
                    {' '.repeat(column - 1)}^
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
