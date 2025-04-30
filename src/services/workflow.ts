
import type { Node, Edge } from 'reactflow';

// Define the structure for a workflow object
export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  status: 'active' | 'paused' | 'error' | 'draft';
  lastRun?: string | Date;
  trigger?: string; // Simple description or type of trigger
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Placeholder data store (replace with actual database interaction)
const workflowsStore: Record<string, Workflow> = {
    "wf-001": { id: "wf-001", name: "Onboard New User", nodes: [], edges: [], status: "active", lastRun: "2 hours ago", trigger: "User Signup", createdAt: new Date(), updatedAt: new Date() },
    "wf-002": { id: "wf-002", name: "Process Order", nodes: [], edges: [], status: "active", lastRun: "5 minutes ago", trigger: "New Order Webhook", createdAt: new Date(), updatedAt: new Date() },
    "wf-003": { id: "wf-003", name: "Generate Weekly Report", nodes: [], edges: [], status: "paused", lastRun: "3 days ago", trigger: "Scheduled (Weekly)", createdAt: new Date(), updatedAt: new Date() },
    "wf-004": { id: "wf-004", name: "Sync CRM Contacts", nodes: [], edges: [], status: "error", lastRun: "1 day ago", trigger: "API Call", createdAt: new Date(), updatedAt: new Date() },
    "wf-005": { id: "wf-005", name: "Send Marketing Email", nodes: [], edges: [], status: "active", lastRun: "10 minutes ago", trigger: "Manual Trigger", createdAt: new Date(), updatedAt: new Date() },
};

/**
 * Fetches all workflows.
 * In a real app, this would fetch from a database.
 * @returns A promise resolving to an array of workflows.
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return Object.values(workflowsStore);
}

/**
 * Fetches a single workflow by its ID.
 * @param id The ID of the workflow to fetch.
 * @returns A promise resolving to the workflow or null if not found.
 */
export async function getWorkflowById(id: string): Promise<Workflow | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return workflowsStore[id] || null;
}

/**
 * Creates a new workflow.
 * @param workflowData Data for the new workflow (excluding id, createdAt, updatedAt).
 * @returns A promise resolving to the newly created workflow.
 */
export async function createWorkflow(workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    // Simulate API delay
   await new Promise(resolve => setTimeout(resolve, 100));
   const newId = `wf-${Date.now()}`; // Simple ID generation
   const now = new Date();
   const newWorkflow: Workflow = {
       ...workflowData,
       id: newId,
       status: workflowData.status || 'draft', // Default to draft
       createdAt: now,
       updatedAt: now,
   };
   workflowsStore[newId] = newWorkflow;
   console.log("Created Workflow:", newWorkflow);
   return newWorkflow;
}

/**
 * Updates an existing workflow.
 * @param id The ID of the workflow to update.
 * @param updates Partial data to update the workflow with.
 * @returns A promise resolving to the updated workflow or null if not found.
 */
export async function updateWorkflow(id: string, updates: Partial<Omit<Workflow, 'id' | 'createdAt'>>): Promise<Workflow | null> {
    // Simulate API delay
   await new Promise(resolve => setTimeout(resolve, 100));
   const existingWorkflow = workflowsStore[id];
   if (!existingWorkflow) {
       return null;
   }
   const updatedWorkflow: Workflow = {
       ...existingWorkflow,
       ...updates,
       updatedAt: new Date(),
   };
   workflowsStore[id] = updatedWorkflow;
   console.log("Updated Workflow:", updatedWorkflow);
   return updatedWorkflow;
}

/**
 * Deletes a workflow by its ID.
 * @param id The ID of the workflow to delete.
 * @returns A promise resolving to true if deletion was successful, false otherwise.
 */
export async function deleteWorkflow(id: string): Promise<boolean> {
    // Simulate API delay
   await new Promise(resolve => setTimeout(resolve, 100));
   if (workflowsStore[id]) {
       delete workflowsStore[id];
       console.log("Deleted Workflow:", id);
       return true;
   }
   return false;
}

/**
 * Executes a workflow (simulated).
 * In a real app, this would trigger the workflow execution engine.
 * @param id The ID of the workflow to execute.
 * @returns A promise resolving to the result of the execution (e.g., success/failure, logs).
 */
export async function executeWorkflow(id: string): Promise<{ success: boolean; message: string; }> {
  // Simulate API delay and execution
  await new Promise(resolve => setTimeout(resolve, 500));
  const workflow = workflowsStore[id];
  if (!workflow) {
    return { success: false, message: "Workflow not found." };
  }
  if (workflow.status !== 'active') {
      // return { success: false, message: `Workflow is not active (status: ${workflow.status}).` };
       console.warn(`Executing workflow ${id} which is not active (status: ${workflow.status}). Allowing for testing.`);
  }

  console.log(`Simulating execution of workflow: ${workflow.name} (${id})`);
  // TODO: Implement actual workflow execution logic here based on nodes and edges.

  // Simulate success/failure randomly for now
  const success = Math.random() > 0.2; // 80% success rate

   // Update last run time
  if (workflowsStore[id]) {
      workflowsStore[id].lastRun = new Date().toISOString();
      if (!success) {
           workflowsStore[id].status = 'error'; // Set status to error on failure
           console.error(`Workflow ${id} execution failed.`);
           return { success: false, message: "Workflow execution failed (simulated)." };
      }
  }


  console.log(`Workflow ${id} execution finished successfully (simulated).`);
  return { success: true, message: "Workflow executed successfully (simulated)." };
}
