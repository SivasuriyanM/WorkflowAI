'use server';
/**
 * @fileOverview Provides functionality to optimize workflow performance by analyzing and suggesting improvements.
 *
 * - optimizeWorkflow - A function that analyzes a given workflow and suggests optimizations.
 * - OptimizeWorkflowInput - The input type for the optimizeWorkflow function, defining the workflow to be analyzed.
 * - OptimizeWorkflowOutput - The output type for the optimizeWorkflow function, providing optimization suggestions.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const OptimizeWorkflowInputSchema = z.object({
  workflowDescription: z
    .string()
    .describe('A detailed description of the workflow to be optimized.'),
  performanceMetrics: z
    .string()
    .optional()
    .describe('Optional performance metrics data for the workflow.'),
});
export type OptimizeWorkflowInput = z.infer<typeof OptimizeWorkflowInputSchema>;

const OptimizeWorkflowOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to optimize the workflow.'),
  explanation: z
    .string()
    .describe('An explanation of why these suggestions would improve performance.'),
});
export type OptimizeWorkflowOutput = z.infer<typeof OptimizeWorkflowOutputSchema>;

export async function optimizeWorkflow(input: OptimizeWorkflowInput): Promise<OptimizeWorkflowOutput> {
  return optimizeWorkflowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeWorkflowPrompt',
  input: {
    schema: z.object({
      workflowDescription: z
        .string()
        .describe('A detailed description of the workflow to be optimized.'),
      performanceMetrics: z
        .string()
        .optional()
        .describe('Optional performance metrics data for the workflow.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z
        .array(z.string())
        .describe('A list of suggestions to optimize the workflow.'),
      explanation: z
        .string()
        .describe('An explanation of why these suggestions would improve performance.'),
    }),
  },
  prompt: `You are an AI expert in workflow optimization. Analyze the following workflow description and provide suggestions to reduce latency and improve efficiency.\n\nWorkflow Description: {{{workflowDescription}}}\n\n{{#if performanceMetrics}}\nPerformance Metrics: {{{performanceMetrics}}}\n{{/if}}\n\nProvide specific, actionable suggestions and explain why each suggestion would improve performance. Return your answer as a list of suggestions and an explanation.`, 
});

const optimizeWorkflowFlow = ai.defineFlow<
  typeof OptimizeWorkflowInputSchema,
  typeof OptimizeWorkflowOutputSchema
>({
  name: 'optimizeWorkflowFlow',
  inputSchema: OptimizeWorkflowInputSchema,
  outputSchema: OptimizeWorkflowOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
