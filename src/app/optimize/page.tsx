"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { optimizeWorkflow, OptimizeWorkflowInput, OptimizeWorkflowOutput } from "@/ai/flows/optimize-workflow";
import React, { useState } from 'react';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  workflowDescription: z.string().min(20, {
    message: "Workflow description must be at least 20 characters.",
  }),
   performanceMetrics: z.string().optional(),
});

export default function OptimizePage() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizeWorkflowOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workflowDescription: "",
      performanceMetrics: "",
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setOptimizationResult(null);
    try {
      const input: OptimizeWorkflowInput = {
          workflowDescription: values.workflowDescription,
          performanceMetrics: values.performanceMetrics || undefined, // Pass undefined if empty
      };
      const result = await optimizeWorkflow(input);
      setOptimizationResult(result);
    } catch (err) {
        console.error("Error optimizing workflow:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Optimize Workflow</h1>
      <p className="text-muted-foreground mb-6">
        Use AI to analyze your workflow and get suggestions for improvement. Describe your workflow steps and optionally provide performance data.
      </p>

      <Card className="shadow-md mb-8">
        <CardHeader>
          <CardTitle>Workflow Analysis</CardTitle>
          <CardDescription>Provide details about the workflow you want to optimize.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="workflowDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the steps, triggers, actions, and integrations involved in your workflow..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as detailed as possible for the best analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="performanceMetrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Metrics (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Average execution time: 5 minutes, Success rate: 95%, Bottleneck: API call to service X takes 30 seconds..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                       Providing metrics like latency, error rates, or bottlenecks can help the AI give more specific advice.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Analyzing..." : "Analyze Workflow"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive" className="mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {optimizationResult && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
            <CardDescription>Here are the AI-powered recommendations to improve your workflow:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold mb-2">Suggestions:</h3>
                 <ul className="list-disc list-inside space-y-1 text-sm">
                    {optimizationResult.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                 </ul>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Explanation:</h3>
                <p className="text-sm text-muted-foreground">{optimizationResult.explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```
  </change>
  <change>
    <file>public/icons/slack.svg</file>
    <description>Add placeholder SVG for Slack icon.</description>
    <content><![CDATA[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-slack"><rect width="6.36" height="6.36" x="11.45" y="11.45" rx="2"/><path d="M11.45 4.64A2 2 0 0 1 13.45 2.64h4.91a2 2 0 0 1 2 2v4.91a2 2 0 0 1-2 2h-2.91"/><rect width="6.36" height="6.36" x="4.64" y="11.45" rx="2"/><path d="M12.55 4.64A2 2 0 0 0 10.55 2.64H5.64a2 2 0 0 0-2 2v4.91a2 2 0 0 0 2 2h2.91"/><rect width="6.36" height="6.36" x="11.45" y="4.64" rx="2"/><path d="M19.36 12.55a2 2 0 0 1 2 2v4.91a2 2 0 0 1-2 2h-4.91a2 2 0 0 1-2-2v-2.91"/><rect width="6.36" height="6.36" x="4.64" y="4.64" rx="2"/><path d="M4.64 12.55a2 2 0 0 0-2 2v4.91a2 2 0 0 0 2 2h4.91a2 2 0 0 0 2-2v-2.91"/></svg>
