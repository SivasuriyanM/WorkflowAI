import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutGrid, Plus, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Workflows</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage and create your automated workflows.
            </p>
            <div className="text-2xl font-bold">5 Active</div> {/* Placeholder */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/workflows" passHref>
              <Button variant="outline" size="sm">
                <LayoutGrid className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
             <Link href="/workflows/new" passHref>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Integrations</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect and manage your third-party applications.
            </p>
            <div className="text-2xl font-bold">12 Connected</div> {/* Placeholder */}
          </CardContent>
          <CardFooter>
            <Link href="/integrations" passHref>
              <Button variant="outline" size="sm">
                Manage Integrations
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
            {/* Consider using a chart icon if available/appropriate */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor the health and efficiency of your workflows.
            </p>
            <div className="text-2xl font-bold text-accent">99.8% Uptime</div> {/* Placeholder */}
          </CardContent>
           <CardFooter>
            <Link href="/optimize" passHref>
              <Button variant="outline" size="sm">
                Optimize Workflows
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
