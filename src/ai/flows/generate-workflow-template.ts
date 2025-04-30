// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for auto-configuring workflow templates based on user behavior.
 *
 * It exports:
 * - `generateWorkflowTemplate`: A function that generates a workflow template based on user behavior.
 * - `GenerateWorkflowTemplateInput`: The input type for the `generateWorkflowTemplate` function.
 * - `GenerateWorkflowTemplateOutput`: The output type for the `generateWorkflowTemplate` function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateWorkflowTemplateInputSchema = z.object({
  userBehavior: z
    .string()
    .describe(
      'A description of the user behavior for creating a workflow template.'
    ),
  existingWorkflowTemplates: z
    .string()
    .optional()
    .describe(
      'A list of existing workflow templates to compare against. Optional.'
    ),
});
export type GenerateWorkflowTemplateInput = z.infer<
  typeof GenerateWorkflowTemplateInputSchema
>;

const GenerateWorkflowTemplateOutputSchema = z.object({
  workflowTemplate: z
    .string()
    .describe('The generated workflow template in JSON format.'),
  explanation: z
    .string()
    .describe('Explanation of why the Workflow Template was created.'),
});
export type GenerateWorkflowTemplateOutput = z.infer<
  typeof GenerateWorkflowTemplateOutputSchema
>;

export async function generateWorkflowTemplate(
  input: GenerateWorkflowTemplateInput
): Promise<GenerateWorkflowTemplateOutput> {
  return generateWorkflowTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkflowTemplatePrompt',
  input: {
    schema: z.object({
      userBehavior: z
        .string()
        .describe(
          'A description of the user behavior for creating a workflow template.'
        ),
      existingWorkflowTemplates: z
        .string()
        .optional()
        .describe(
          'A list of existing workflow templates to compare against. Optional.'
        ),
    }),
  },
  output: {
    schema: z.object({
      workflowTemplate: z
        .string()
        .describe('The generated workflow template in JSON format.'),
      explanation: z
        .string()
        .describe('Explanation of why the Workflow Template was created.'),
    }),
  },
  prompt: `You are an AI expert in workflow automation. Based on the user's past behavior, you will generate a workflow template that the user may find useful.

User Behavior: {{{userBehavior}}}

Existing Workflow Templates: {{{existingWorkflowTemplates}}}

Output the workflow template as a JSON object.  Also, explain why you believe this template would be useful to the user.
`,
});

const generateWorkflowTemplateFlow = ai.defineFlow<
  typeof GenerateWorkflowTemplateInputSchema,
  typeof GenerateWorkflowTemplateOutputSchema
>(
  {
    name: 'generateWorkflowTemplateFlow',
    inputSchema: GenerateWorkflowTemplateInputSchema,
    outputSchema: GenerateWorkflowTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
