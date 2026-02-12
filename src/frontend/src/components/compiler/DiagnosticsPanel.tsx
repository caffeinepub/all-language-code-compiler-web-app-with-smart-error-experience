import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { CodeFrame } from './CodeFrame';
import type { Diagnostic } from '@/types/compiler';

interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
  code: string;
}

export function DiagnosticsPanel({ diagnostics, code }: DiagnosticsPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDiagnostic = diagnostics[selectedIndex];

  const getSeverityIcon = (severity: Diagnostic['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: Diagnostic['severity']) => {
    const variants = {
      error: 'destructive',
      warning: 'default',
      info: 'secondary',
    } as const;
    return variants[severity];
  };

  return (
    <div className="space-y-4">
      {/* Diagnostics List */}
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-2 space-y-2">
          {diagnostics.map((diagnostic, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all hover:bg-accent/50 ${
                selectedIndex === index ? 'ring-2 ring-ring bg-accent/30' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {getSeverityIcon(diagnostic.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityBadge(diagnostic.severity)} className="text-xs">
                        {diagnostic.severity.toUpperCase()}
                      </Badge>
                      {diagnostic.line !== undefined && (
                        <span className="text-xs text-muted-foreground font-mono">
                          Line {diagnostic.line}
                          {diagnostic.column !== undefined && `:${diagnostic.column}`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm break-words">{diagnostic.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Code Frame */}
      {selectedDiagnostic && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            {getSeverityIcon(selectedDiagnostic.severity)}
            Code Context
          </h4>
          <CodeFrame diagnostic={selectedDiagnostic} code={code} />
        </div>
      )}
    </div>
  );
}
