"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Play, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  connections: any[];
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = React.useState<Workflow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "" });

  React.useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("/api/workflows");
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkflow),
      });

      if (response.ok) {
        const created = await response.json();
        window.location.href = `/workflows/${created.id}`;
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;

    try {
      await fetch(`/api/workflows/${id}`, { method: "DELETE" });
      fetchWorkflows();
    } catch (error) {
      console.error("Error deleting workflow:", error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/workflows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchWorkflows();
    } catch (error) {
      console.error("Error toggling workflow:", error);
    }
  };

  const executeWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/execute/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      alert(
        result.success
          ? "Workflow executed successfully!"
          : `Error: ${result.error}`
      );
    } catch (error) {
      console.error("Error executing workflow:", error);
      alert("Failed to execute workflow");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Workflows
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create and manage your automation workflows
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Give your workflow a name and description
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="My Automation Workflow"
                    value={newWorkflow.name}
                    onChange={(e) =>
                      setNewWorkflow({ ...newWorkflow, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this workflow do?"
                    value={newWorkflow.description}
                    onChange={(e) =>
                      setNewWorkflow({
                        ...newWorkflow,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createWorkflow} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Workflow"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {workflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No workflows yet. Create your first one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{workflow.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {workflow.description || "No description"}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={() =>
                        toggleActive(workflow.id, workflow.isActive)
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p>Nodes: {workflow.nodes.length}</p>
                      <p>Connections: {workflow.connections.length}</p>
                      <p className="mt-2">
                        Updated:{" "}
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1"
                      >
                        <Link href={`/workflows/${workflow.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeWorkflow(workflow.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
