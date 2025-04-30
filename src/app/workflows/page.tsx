import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Placeholder data - replace with actual data fetching
const workflows = [
  { id: "wf-001", name: "Onboard New User", status: "active", lastRun: "2 hours ago", trigger: "User Signup" },
  { id: "wf-002", name: "Process Order", status: "active", lastRun: "5 minutes ago", trigger: "New Order Webhook" },
  { id: "wf-003", name: "Generate Weekly Report", status: "paused", lastRun: "3 days ago", trigger: "Scheduled (Weekly)" },
  { id: "wf-004", name: "Sync CRM Contacts", status: "error", lastRun: "1 day ago", trigger: "API Call" },
  { id: "wf-005", name: "Send Marketing Email", status: "active", lastRun: "10 minutes ago", trigger: "Manual Trigger" },
];

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <Link href="/workflows/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Workflow
          </Button>
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
        </CardHeader>
        <CardContent>
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
                   <TableCell>{workflow.trigger}</TableCell>
                  <TableCell>{workflow.lastRun}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/workflows/${workflow.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                         <DropdownMenuItem>{workflow.status === 'active' ? 'Pause' : 'Activate'}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
