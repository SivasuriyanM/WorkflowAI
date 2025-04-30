
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, Save, Settings, Zap, GitBranch, Terminal, HelpCircle, MousePointerSquare, Puzzle, Database, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';

// --- Custom Node Components ---

// Basic structure for node data
type NodeData = {
  label: string;
  description?: string;
  icon?: React.ElementType;
  color?: string; // Optional background color for the node
};

// Simple node component
const CustomNode: React.FC<{ data: NodeData, selected: boolean }> = ({ data, selected }) => {
  const Icon = data.icon || Puzzle;
  return (
    <div
      className={cn(
        "p-3 border rounded-md shadow-md min-w-[180px] bg-card text-card-foreground transition-all duration-150",
        selected ? 'border-ring ring-2 ring-ring' : 'border-border',
        data.color // Apply background color if specified
      )}
      style={data.color ? { backgroundColor: data.color } : {}}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div className="font-semibold text-sm flex-1 truncate">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground">{data.description}</div>
      )}
      {/* Input/Output handles could be added here using React Flow's Handle component */}
    </div>
  );
};

// --- Node Types ---
const nodeTypes: NodeTypes = {
  trigger: CustomNode,
  action: CustomNode,
  logic: CustomNode,
  // Add more specific node types here if needed
};

// --- Initial Elements ---
const initialNodes: Node<NodeData>[] = [
  {
    id: 'start-node',
    type: 'trigger', // Custom type or default
    position: { x: 100, y: 150 },
    data: { label: 'Start', description: 'Workflow entry point', icon: Play, color: 'hsl(var(--accent))' }, // Use accent color for Start
  },
];

const initialEdges: Edge[] = [];

// --- Node Panel Data ---
const nodePanelItems = [
    { category: "Triggers", items: [
        { id: 'trigger-webhook', type: 'trigger', label: 'Webhook', description: 'Trigger via HTTP request', icon: GitBranch },
        { id: 'trigger-schedule', type: 'trigger', label: 'Schedule', description: 'Run at specific times', icon: Zap },
        { id: 'trigger-manual', type: 'trigger', label: 'Manual', description: 'Start workflow manually', icon: MousePointerSquare },
    ]},
    { category: "Actions", items: [
        { id: 'action-httpRequest', type: 'action', label: 'HTTP Request', description: 'Call external APIs', icon: Terminal },
        { id: 'action-sendEmail', type: 'action', label: 'Send Email', description: 'Notify via email', icon: MessageSquare },
        { id: 'action-database', type: 'action', label: 'Database Op', description: 'Interact with DBs', icon: Database },
    ]},
     { category: "Logic", items: [
        { id: 'logic-if', type: 'logic', label: 'IF', description: 'Conditional branching', icon: HelpCircle },
        { id: 'logic-switch', type: 'logic', label: 'Switch', description: 'Multi-way branching', icon: Puzzle }, // Reusing Puzzle icon
    ]},
    // Add more categories and nodes as needed
];

export default function NewWorkflowPage() {
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null); // For drag & drop

  // --- React Flow Callbacks ---
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection | Edge) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null); // Deselect node when clicking on the canvas background
  }, []);

  // --- Drag and Drop Functionality ---
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow-nodetype');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const description = event.dataTransfer.getData('application/reactflow-description');
      const iconName = event.dataTransfer.getData('application/reactflow-icon');
      const nodeColor = event.dataTransfer.getData('application/reactflow-color'); // Get color if set


       // Find icon component by name (this is basic, might need a map)
      let IconComponent = Puzzle; // Default
      if(iconName === 'GitBranch') IconComponent = GitBranch;
      if(iconName === 'Zap') IconComponent = Zap;
      if(iconName === 'MousePointerSquare') IconComponent = MousePointerSquare;
      if(iconName === 'Terminal') IconComponent = Terminal;
      if(iconName === 'MessageSquare') IconComponent = MessageSquare;
      if(iconName === 'Database') IconComponent = Database;
      if(iconName === 'HelpCircle') IconComponent = HelpCircle;


      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node<NodeData> = {
        id: `${type}-${+new Date()}`, // Simple unique ID
        type,
        position,
        data: { label: label || `New ${type}`, description, icon: IconComponent, color: nodeColor || undefined },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

   // --- Draggable Node Item Component ---
   const DraggableNodeItem = ({ nodeType, label, description, icon: Icon, color }: { nodeType: string, label: string, description?: string, icon?: React.ElementType, color?: string }) => {
    const onDragStart = (event: React.DragEvent) => {
      event.dataTransfer.setData('application/reactflow-nodetype', nodeType);
      event.dataTransfer.setData('application/reactflow-label', label);
      if(description) event.dataTransfer.setData('application/reactflow-description', description);
      if(Icon) event.dataTransfer.setData('application/reactflow-icon', Icon.displayName || Icon.name); // Pass icon name
      if(color) event.dataTransfer.setData('application/reactflow-color', color); // Pass color
      event.dataTransfer.effectAllowed = 'move';
    };

    const DisplayIcon = Icon || Puzzle;

    return (
      <div
        className="p-2 border rounded-md bg-card hover:shadow-md cursor-grab flex items-center gap-2 transition-shadow duration-150"
        onDragStart={onDragStart}
        draggable
      >
          <DisplayIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
              <div className="text-sm font-medium truncate">{label}</div>
              {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
          </div>

      </div>
    );
  };

  // --- Action Handlers ---
  const handleSave = () => {
    // TODO: Implement save logic (e.g., send nodes and edges to backend)
    console.log("Saving workflow:", workflowName, nodes, edges);
    // Show toast notification or similar feedback
  };

  const handleRunTest = () => {
     // TODO: Implement test run logic
    console.log("Running test for workflow:", workflowName);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust height based on header/navbar */}
      {/* Header Bar */}
      <div className="flex justify-between items-center p-3 border-b bg-background sticky top-0 z-10 h-14">
        <div className="flex items-center gap-3">
           <Link href="/workflows" passHref>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
           </Link>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow Name"
            className="text-base font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto px-2 h-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRunTest}>
            <Play className="mr-2 h-4 w-4" /> Test
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node Panel (Sidebar) */}
        <Card className="w-60 border-r rounded-none h-full flex flex-col">
          <CardHeader className="p-3">
            <CardTitle className="text-base">Nodes</CardTitle>
             {/* Optional: Add search input here */}
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
             <CardContent className="p-3 flex flex-col gap-3">
                {nodePanelItems.map((group) => (
                    <div key={group.category}>
                        <Label className="text-xs font-semibold text-muted-foreground px-1 mb-2 block">{group.category}</Label>
                        <div className="flex flex-col gap-2">
                            {group.items.map(item => (
                                <DraggableNodeItem
                                    key={item.id}
                                    nodeType={item.type}
                                    label={item.label}
                                    description={item.description}
                                    icon={item.icon}
                                    color={item.id === 'start-node' ? 'hsl(var(--accent))' : undefined} // Example color for Start node in panel
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Workflow Canvas (React Flow) */}
        <div className="flex-1 bg-background relative" style={{ height: '100%' }}>
           <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance} // Capture instance for drag & drop
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            className="bg-secondary/30" // Subtle background
          >
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Background color="hsl(var(--border))" gap={16} />
          </ReactFlow>
        </div>

        {/* Config Panel (Sidebar) */}
         <Card className={cn(
             "w-72 border-l rounded-none h-full flex flex-col transition-all duration-300 ease-in-out",
             selectedNode ? "translate-x-0" : "translate-x-full absolute right-0" // Slide in/out
         )}>
             <CardHeader className="p-3">
                 <CardTitle className="text-base flex items-center gap-2">
                     <Settings className="h-4 w-4" />
                     Node Configuration
                 </CardTitle>
                 <CardDescription className="text-xs">
                    {selectedNode ? `Editing: ${selectedNode.data.label}` : "Select a node to edit"}
                 </CardDescription>
             </CardHeader>
             <Separator />
             <ScrollArea className="flex-1">
                <CardContent className="p-3 space-y-4">
                 {selectedNode ? (
                     <>
                        <div>
                            <Label htmlFor="node-label">Label</Label>
                            <Input
                                id="node-label"
                                value={selectedNode.data.label}
                                onChange={(e) => {
                                    const newLabel = e.target.value;
                                    setNodes((nds) =>
                                        nds.map((node) =>
                                            node.id === selectedNode.id
                                                ? { ...node, data: { ...node.data, label: newLabel } }
                                                : node
                                        )
                                    );
                                    // Also update the selectedNode state locally for immediate feedback
                                    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null);
                                }}
                                placeholder="Node Label"
                                className="h-8"
                            />
                        </div>
                         <div>
                            <Label htmlFor="node-description">Description</Label>
                            <Input
                                id="node-description"
                                value={selectedNode.data.description || ''}
                                onChange={(e) => {
                                    const newDescription = e.target.value;
                                    setNodes((nds) =>
                                        nds.map((node) =>
                                            node.id === selectedNode.id
                                                ? { ...node, data: { ...node.data, description: newDescription } }
                                                : node
                                        )
                                    );
                                     setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, description: newDescription } } : null);
                                }}
                                placeholder="Optional description"
                                 className="h-8"
                            />
                        </div>
                        {/* Add more configuration options based on node type */}
                        {selectedNode.type === 'action' && selectedNode.data.label === 'HTTP Request' && (
                             <div>
                                <Label htmlFor="node-url">URL</Label>
                                <Input id="node-url" placeholder="https://api.example.com/data" className="h-8"/>
                             </div>
                        )}
                         {selectedNode.type === 'trigger' && selectedNode.data.label === 'Schedule' && (
                             <div>
                                <Label htmlFor="node-cron">Cron Expression</Label>
                                <Input id="node-cron" placeholder="0 * * * *" className="h-8"/>
                             </div>
                        )}
                         {/* Add more specific fields */}
                        <Separator className="my-4" />
                        <p className="text-xs text-muted-foreground">ID: {selectedNode.id}</p>
                     </>
                 ) : (
                     <p className="text-sm text-muted-foreground p-4 text-center">Select a node on the canvas to configure its properties.</p>
                 )}
                 </CardContent>
             </ScrollArea>
         </Card>
      </div>
    </div>
  );
}
