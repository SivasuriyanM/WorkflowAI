
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Play, Pause, Trash2, Edit, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAllWorkflows, deleteWorkflow, updateWorkflow, Workflow, executeWorkflow } from '@/services/workflow'; // Import service
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const { toast } = useToast(); // Initialize toast

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError("Failed to fetch workflows.");
      console.error(err);
       toast({ // Show error toast
        variant: "destructive",
        title: "Error",
        description: "Could not load workflows.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on initial load

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteWorkflow(id);
      if (success) {
        setWorkflows(prev => prev.filter(wf => wf.id !== id));
         toast({
          title: "Success",
          description: "Workflow deleted successfully.",
        });
      } else {
        throw new Error("Workflow not found or deletion failed");
      }
    } catch (err) {
      console.error("Failed to delete workflow:", err);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete workflow.",
      });
    }
  };

   const handleToggleStatus = async (id: string, currentStatus: Workflow['status']) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        try {
            const updatedWorkflow = await updateWorkflow(id, { status: newStatus });
            if (updatedWorkflow) {
                setWorkflows(prev => prev.map(wf => wf.id === id ? updatedWorkflow : wf));
                toast({
                    title: "Status Updated",
                    description: `Workflow ${newStatus === 'active' ? 'activated' : 'paused'}.`,
                });
            } else {
                 throw new Error("Workflow not found or update failed");
            }
        } catch (err) {
            console.error(`Failed to ${newStatus === 'active' ? 'activate' : 'pause'} workflow:`, err);
             toast({
                variant: "destructive",
                title: "Error",
                description: `Could not ${newStatus === 'active' ? 'activate' : 'pause'} workflow.`,
            });
        }
    };

   const handleExecute = async (id: string) => {
        setExecutingId(id);
        try {
            const result = await executeWorkflow(id);
            if(result.success) {
                 toast({
                    title: "Workflow Executed",
                    description: result.message,
                 });
                 // Optionally re-fetch to update last run time displayed
                 // fetchWorkflows(); // Or update locally:
                 setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, lastRun: new Date().toISOString(), status: 'active' } : wf));

            } else {
                 toast({
                    variant: "destructive",
                    title: "Execution Failed",
                    description: result.message,
                 });
                 // Optionally update status locally if backend doesn't
                 setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, status: 'error' } : wf));
            }
        } catch (err) {
            console.error("Failed to execute workflow:", err);
             toast({
                variant: "destructive",
                title: "Execution Error",
                description: "An unexpected error occurred during execution.",
            });
             setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, status: 'error' } : wf));
        } finally {
            setExecutingId(null);
        }
    }


  const formatLastRun = (lastRun?: string | Date): string => {
    if (!lastRun) return 'Never';
    try {
      return formatDistanceToNow(new Date(lastRun), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={fetchWorkflows} disabled={isLoading}>
               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
               <span className="sr-only">Refresh</span>
           </Button>
          <Link href="/workflows/new" passHref>
            <Button disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" /> Create Workflow
            </Button>
          </Link>
        </div>
      </div>

       {error && (
        <Card className="mb-4 border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
             <AlertCircle className="h-5 w-5 text-destructive" />
             <div>
                <CardTitle className="text-destructive text-base">Loading Error</CardTitle>
                <CardDescription className="text-destructive/80 text-sm">{error}</CardDescription>
             </div>
          </CardHeader>
        </Card>
      )}


      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
           <CardDescription>Manage and monitor your automation flows.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
               <div className="flex justify-center items-center py-10">
                   <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
           ) : workflows.length === 0 && !error ? (
                <p className="text-center text-muted-foreground py-10">No workflows created yet. <Link href="/workflows/new" className="text-primary hover:underline">Create your first workflow!</Link></p>
           ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell>
                        <Badge variant={workflow.status === 'active' ? 'default' : workflow.status === 'paused' ? 'secondary' : 'destructive'}
                               className={workflow.status === 'active' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}>
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{workflow.trigger || 'N/A'}</TableCell>
                      <TableCell>{formatLastRun(workflow.lastRun)}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={executingId === workflow.id}>
                              <span className="sr-only">Open menu</span>
                               {executingId === workflow.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DropdownMenuItem onSelect={() => handleExecute(workflow.id)} disabled={executingId === workflow.id}>
                                 <Play className="mr-2 h-4 w-4" /> Run Now
                             </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <Link href={`/workflows/${workflow.id}/edit`}>
                                 <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => handleToggleStatus(workflow.id, workflow.status)}>
                                {workflow.status === 'active' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                {workflow.status === 'active' ? 'Pause' : 'Activate'}
                            </DropdownMenuItem>
                             {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                       <Trash2 className="mr-2 h-4 w-4" /> Delete
                                     </DropdownMenuItem>
                                </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the workflow "{workflow.name}".
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(workflow.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                             </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
