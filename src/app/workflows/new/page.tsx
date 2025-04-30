"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Save, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from 'react';

// Placeholder components for triggers, actions, etc.
const TriggerNode = ({ id, data }: { id: string, data: any }) => (
  <div className="p-4 border rounded-lg bg-white shadow min-w-[150px] cursor-grab">
    <div className="font-semibold text-sm mb-1">Trigger</div>
    <div className="text-xs text-muted-foreground">{data.label}</div>
  </div>
);

const ActionNode = ({ id, data }: { id: string, data: any }) => (
  <div className="p-4 border rounded-lg bg-white shadow min-w-[150px] cursor-grab">
    <div className="font-semibold text-sm mb-1">Action</div>
    <div className="text-xs text-muted-foreground">{data.label}</div>
    <Settings className="absolute top-1 right-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
  </div>
);

// Basic simulation of drag-and-drop nodes
const initialNodes = [
  { id: '1', type: 'trigger', position: { x: 50, y: 100 }, data: { label: 'Webhook Received' } },
  { id: '2', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Send Slack Message' } },
];

export default function NewWorkflowPage() {
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [nodes, setNodes] = useState(initialNodes); // Simplified state for nodes

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving workflow:", workflowName, nodes);
    // Show toast notification or similar feedback
  };

  const handleRunTest = () => {
     // TODO: Implement test run logic
    console.log("Running test for workflow:", workflowName);
  }

  const addNode = (type: 'trigger' | 'action') => {
    const newNode = {
        id: (nodes.length + 1).toString(),
        type: type,
        position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 }, // Random position for demo
        data: { label: `New ${type}` }
    };
    setNodes([...nodes, newNode]);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust height based on header */}
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <Link href="/workflows" passHref>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
           </Link>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRunTest}>
            <Play className="mr-2 h-4 w-4" /> Test Workflow
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for adding nodes */}
        <Card className="w-64 border-r rounded-none h-full overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-base">Add Nodes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4">
            <Button variant="outline" onClick={() => addNode('trigger')}>Add Trigger</Button>
            <Button variant="outline" onClick={() => addNode('action')}>Add Action</Button>
             {/* Add more draggable node types here */}
            <div className="p-2 border rounded bg-secondary text-sm cursor-grab mt-4">Webhook</div>
            <div className="p-2 border rounded bg-secondary text-sm cursor-grab">Send Email</div>
            <div className="p-2 border rounded bg-secondary text-sm cursor-grab">Update CRM</div>
             <div className="p-2 border rounded bg-secondary text-sm cursor-grab">Conditional Logic</div>
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <div className="flex-1 bg-secondary/40 relative overflow-auto p-4">
          {/* Placeholder for drag-and-drop canvas */}
          <div className="relative w-full h-full border border-dashed border-muted-foreground rounded-lg">
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground">Drag nodes here to build your workflow</p>
              {/* Render nodes - In a real app, use a library like React Flow */}
              {nodes.map(node => (
                 <div
                    key={node.id}
                    className="absolute"
                    style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                >
                  {node.type === 'trigger' ? (
                    <TriggerNode id={node.id} data={node.data} />
                  ) : (
                    <ActionNode id={node.id} data={node.data} />
                  )}
                 </div>
              ))}
              {/* Placeholder lines/edges - In a real app, these would connect nodes */}
              {nodes.length > 1 && (
                 <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <line x1={nodes[0].position.x + 150} y1={nodes[0].position.y + 30} x2={nodes[1].position.x} y2={nodes[1].position.y + 30} stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                 </svg>
              )}
          </div>
        </div>

         {/* Properties Panel (Optional) */}
         <Card className="w-72 border-l rounded-none h-full overflow-y-auto hidden lg:block">
             <CardHeader>
                 <CardTitle className="text-base">Node Settings</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                 <p className="text-sm text-muted-foreground">Select a node to configure its settings.</p>
                 {/* Example Settings */}
                 {/* <div>
                     <Label htmlFor="node-name">Node Name</Label>
                     <Input id="node-name" placeholder="e.g., Send Welcome Email"/>
                 </div>
                 <div>
                     <Label htmlFor="email-subject">Subject</Label>
                     <Input id="email-subject" placeholder="Welcome to FlowAI!"/>
                 </div>
                 <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Delete Node</Button> */}
             </CardContent>
         </Card>
      </div>
    </div>
  );
}
