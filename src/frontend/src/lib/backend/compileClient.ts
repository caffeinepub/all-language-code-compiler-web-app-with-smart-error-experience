import type { CompileRequest, CompileResult } from '@/types/compiler';

/**
 * Mock implementation of compile/run client.
 * This will be replaced with actual backend integration once the backend
 * implements the compile/run method.
 */
export async function compileAndRun(request: CompileRequest): Promise<CompileResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses based on language
  const mockResponses: Record<string, CompileResult> = {
    python: {
      stdout: 'Hello, World!\n',
      stderr: '',
      status: 0,
      timing: 142,
    },
    javascript: {
      stdout: 'Hello, World!\n',
      stderr: '',
      status: 0,
      timing: 98,
    },
    rust: {
      stdout: '',
      stderr: 'error[E0425]: cannot find value `x` in this scope\n --> src/main.rs:2:5\n  |\n2 |     x = 10;\n  |     ^ not found in this scope\n\nerror: aborting due to previous error',
      status: 1,
      timing: 523,
    },
    cpp: {
      stdout: '',
      stderr: 'main.cpp:5:5: error: \'x\' was not declared in this scope\n    5 |     x = 10;\n      |     ^\nmain.cpp:6:17: warning: unused variable \'y\' [-Wunused-variable]\n    6 |     int y = 20;\n      |         ^',
      status: 1,
      timing: 312,
    },
    java: {
      stdout: '',
      stderr: 'Main.java:3: error: cannot find symbol\n        System.out.println(x);\n                           ^\n  symbol:   variable x\n  location: class Main\n1 error',
      status: 1,
      timing: 876,
    },
  };

  // Check for simple syntax to determine success/failure
  const hasError = request.code.includes('error') || 
                   request.code.includes('undefined') ||
                   !request.code.trim();

  if (hasError && request.language in mockResponses) {
    return mockResponses[request.language];
  }

  // Default success response
  return {
    stdout: request.stdin 
      ? `Input received: ${request.stdin}\nHello, World!\n`
      : 'Hello, World!\n',
    stderr: '',
    status: 0,
    timing: Math.floor(Math.random() * 500) + 100,
  };
}
