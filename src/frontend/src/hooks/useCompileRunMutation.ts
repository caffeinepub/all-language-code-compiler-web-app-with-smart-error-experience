import { useMutation } from '@tanstack/react-query';
import type { CompileRequest, CompileResult } from '@/types/compiler';
import { compileAndRun } from '@/lib/backend/compileClient';

export function useCompileRunMutation() {
  return useMutation<CompileResult, Error, CompileRequest>({
    mutationFn: async (request: CompileRequest) => {
      return await compileAndRun(request);
    },
    retry: 1,
  });
}
