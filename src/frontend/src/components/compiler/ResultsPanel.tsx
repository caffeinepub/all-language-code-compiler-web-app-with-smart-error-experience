import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock, Terminal, AlertTriangle } from 'lucide-react';
import { DiagnosticsPanel } from './DiagnosticsPanel';
import { parseDiagnostics } from '@/lib/diagnostics/parseDiagnostics';
import type { CompileResult } from '@/types/compiler';

interface ResultsPanelProps {
  result: CompileResult;
  code: string;
}

export function ResultsPanel({ result, code }: ResultsPanelProps) {
  const diagnostics = result.stderr ? parseDiagnostics(result.stderr) : [];
  const hasErrors = diagnostics.some(d => d.severity === 'error');
  const hasWarnings = diagnostics.some(d => d.severity === 'warning');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {result.status === 0 ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                Execution Successful
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                Execution Failed
              </>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {result.timing && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.timing}ms
              </Badge>
            )}
            <Badge variant={result.status === 0 ? 'default' : 'destructive'}>
              Exit: {result.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={diagnostics.length > 0 ? 'diagnostics' : 'stdout'} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stdout" className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Output
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Diagnostics
              {diagnostics.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
                  {diagnostics.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stderr" className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" />
              Raw Error
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stdout" className="mt-4">
            <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-4">
              {result.stdout ? (
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                  {result.stdout}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground italic">No output</p>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-4">
            {diagnostics.length > 0 ? (
              <DiagnosticsPanel diagnostics={diagnostics} code={code} />
            ) : (
              <div className="rounded-md border bg-muted/30 p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No errors or warnings detected
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stderr" className="mt-4">
            <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-4">
              {result.stderr ? (
                <pre className="text-sm font-mono whitespace-pre-wrap break-words text-destructive">
                  {result.stderr}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground italic">No errors</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
