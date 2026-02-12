import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, AlertCircle, CheckCircle2, Clock, Terminal } from 'lucide-react';
import { useCompileRunMutation } from '@/hooks/useCompileRunMutation';
import { DiagnosticsPanel } from '@/components/compiler/DiagnosticsPanel';
import { ResultsPanel } from '@/components/compiler/ResultsPanel';
import type { CompileRequest } from '@/types/compiler';

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python', defaultCode: 'print("Hello, World!")' },
  { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello, World!");' },
  { id: 'rust', name: 'Rust', defaultCode: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
];

export function CompilerPage() {
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0].id);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].defaultCode);
  const [stdin, setStdin] = useState('');

  const { mutate: compileRun, isPending, data: result, error, reset } = useCompileRunMutation();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const lang = SUPPORTED_LANGUAGES.find(l => l.id === newLanguage);
    if (lang) {
      setCode(lang.defaultCode);
    }
  };

  const handleCompileRun = () => {
    const request: CompileRequest = {
      language,
      code,
      stdin: stdin || undefined,
    };
    compileRun(request);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/compiler-logo.dim_512x512.png" 
                alt="Compiler Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CodeRunner</h1>
                <p className="text-sm text-muted-foreground">Smart multi-language compiler</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5">
              <Terminal className="h-3 w-3" />
              {SUPPORTED_LANGUAGES.length} Languages
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Compile & Run Code Instantly</h2>
              <p className="text-muted-foreground text-lg">
                Write code in your favorite language and get intelligent error diagnostics with line-by-line analysis.
              </p>
            </div>
            <img 
              src="/assets/generated/compiler-hero.dim_1600x900.png" 
              alt="Code Illustration" 
              className="w-full md:w-80 h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang.id} value={lang.id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write your code here..."
                    className="font-mono text-sm min-h-[300px] resize-y"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Standard Input (optional)</label>
                  <Textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="font-mono text-sm min-h-[80px] resize-y"
                  />
                </div>
                <Button 
                  onClick={handleCompileRun} 
                  disabled={isPending || !code.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Compile & Run
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error instanceof Error ? error.message : 'Failed to compile code'}</span>
                  <Button variant="outline" size="sm" onClick={() => reset()}>
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {result && <ResultsPanel result={result} code={code} />}

            {!result && !error && !isPending && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Terminal className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to compile</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a language, write your code, and click "Compile & Run" to see the results and smart error diagnostics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CodeRunner. All rights reserved.</p>
            <p>
              Built with ❤️ using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'coderunner-app')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
