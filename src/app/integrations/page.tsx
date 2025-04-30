import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plug, Plus, Search } from "lucide-react";
import Image from 'next/image'; // Using next/image for optimization

// Placeholder data for integrations
const connectedIntegrations = [
  { id: "integ-001", name: "Slack", description: "Team Communication", logo: "/icons/slack.svg", connected: true }, // Assume you have icons in public/icons
  { id: "integ-002", name: "Google Drive", description: "Cloud Storage", logo: "/icons/google-drive.svg", connected: true },
  { id: "integ-003", name: "Salesforce", description: "CRM Platform", logo: "/icons/salesforce.svg", connected: true },
];

const availableIntegrations = [
  { id: "integ-004", name: "Trello", description: "Project Management", logo: "/icons/trello.svg", connected: false },
  { id: "integ-005", name: "GitHub", description: "Code Hosting", logo: "/icons/github.svg", connected: false },
  { id: "integ-006", name: "Mailchimp", description: "Email Marketing", logo: "/icons/mailchimp.svg", connected: false },
  { id: "integ-007", name: "Stripe", description: "Payment Processing", logo: "/icons/stripe.svg", connected: false },
  { id: "integ-008", name: "HubSpot", description: "Marketing & Sales", logo: "/icons/hubspot.svg", connected: false },
];

// Placeholder SVG icons (replace with actual SVGs or images in public/icons)
const PlaceholderIcon = () => <Plug className="h-10 w-10 text-muted-foreground" />;
const icons: Record<string, JSX.Element | string> = {
  "/icons/slack.svg": PlaceholderIcon(),
  "/icons/google-drive.svg": PlaceholderIcon(),
  "/icons/salesforce.svg": PlaceholderIcon(),
  "/icons/trello.svg": PlaceholderIcon(),
  "/icons/github.svg": PlaceholderIcon(),
  "/icons/mailchimp.svg": PlaceholderIcon(),
  "/icons/stripe.svg": PlaceholderIcon(),
  "/icons/hubspot.svg": PlaceholderIcon(),
};

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search integrations..." className="pl-10" />
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Connected Integrations</h2>
        {connectedIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  {typeof icons[integration.logo] === 'string' ? (
                    <Image src={icons[integration.logo] as string} alt={`${integration.name} logo`} width={40} height={40} className="rounded-sm" />
                  ) : (
                     React.cloneElement(icons[integration.logo] as JSX.Element, { className: "h-10 w-10 text-muted-foreground" })
                  )}
                  <div className="grid gap-1">
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No integrations connected yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Integrations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                 {typeof icons[integration.logo] === 'string' ? (
                    <Image src={icons[integration.logo] as string} alt={`${integration.name} logo`} width={40} height={40} className="rounded-sm" />
                  ) : (
                     React.cloneElement(icons[integration.logo] as JSX.Element, { className: "h-10 w-10 text-muted-foreground" })
                  )}
                <div className="grid gap-1">
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter>
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" /> Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Need to import React for JSX processing
import React from 'react';
