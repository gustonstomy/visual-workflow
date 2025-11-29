/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Play, Edit, Trash2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playDialogOpen, setPlayDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  React.useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("/api/workflows");
      const data = await response.json();

      // Check if response is unauthorized or an error
      if (!response.ok || data.error) {
        console.error("Error fetching workflows:", data.error);
        // Redirect to login if unauthorized
        // if (response.status === 401) {
        //   signOut({ callbackUrl: "/login" });
        // }
        setWorkflows([]);
        return;
      }

      // Ensure data is an array
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      setWorkflows([]);
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

  const handleDeleteClick = (id: string) => {
    setSelectedWorkflowId(id);
    setDeleteDialogOpen(true);
  };

  const deleteWorkflow = async () => {
    if (!selectedWorkflowId) return;

    try {
      await fetch(`/api/workflows/${selectedWorkflowId}`, { method: "DELETE" });
      toast({
        title: "Success",
        description: "Workflow deleted successfully",
        variant: "success",
      });
      fetchWorkflows();
      setDeleteDialogOpen(false);
      setSelectedWorkflowId(null);
    } catch (error) {
      console.error("Error deleting workflow:", error);
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive",
      });
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

  const handlePlayClick = (id: string) => {
    setSelectedWorkflowId(id);
    setPlayDialogOpen(true);
  };

  const executeWorkflow = async () => {
    if (!selectedWorkflowId) return;

    try {
      const response = await fetch(`/api/execute/${selectedWorkflowId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Workflow executed successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute workflow",
          variant: "destructive",
        });
      }

      setPlayDialogOpen(false);
      setSelectedWorkflowId(null);
    } catch (error) {
      console.error("Error executing workflow:", error);
      toast({
        title: "Error",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
      setPlayDialogOpen(false);
      setSelectedWorkflowId(null);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Workflows
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create and manage your automation workflows
            </p>
          </div>

          <div className="flex gap-3">
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 hover:bg-black hover:text-white bg-transparent"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-linear-to-br dark:from-slate-950 dark:to-slate-900 border-white text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Confirm Logout
                  </DialogTitle>
                  <DialogDescription className="text-white">
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setLogoutDialogOpen(false)}
                    className="hover:bg-slate-800 hover:text-white bg-transparent border-white text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="hover:bg-red-700 bg-red-600 text-white border-white"
                  >
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="gap-2  hover:bg-black hover:text-white bg-transparent border border-white"
                >
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
                  <Button
                    onClick={createWorkflow}
                    disabled={isCreating}
                    className="hover:bg-black hover:text-white bg-transparent border border-white"
                  >
                    {isCreating ? "Creating..." : "Create Workflow"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {workflows?.length === 0 ? (
          <div className="h-[70vh] w-full flex items-center justify-center">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-white  font-bold mb-4 text-lg">
                  No workflows yet. Create your first one to get started!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows?.map((workflow) => (
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
                        className="flex-1  hover:bg-black hover:text-white bg-transparent"
                      >
                        <Link href={`/workflows/${workflow.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className=" hover:bg-black hover:text-white bg-transparent"
                        onClick={() => handlePlayClick(workflow.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className=" hover:bg-black hover:text-white bg-transparent"
                        onClick={() => handleDeleteClick(workflow.id)}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-linear-to-br dark:from-slate-950 dark:to-slate-900 border-white text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Workflow</DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to delete this workflow? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="hover:bg-slate-800 hover:text-white bg-transparent border-white text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={deleteWorkflow}
                className="hover:bg-red-700 bg-red-600 text-white border-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Play Confirmation Dialog */}
        <Dialog open={playDialogOpen} onOpenChange={setPlayDialogOpen}>
          <DialogContent className="bg-linear-to-br dark:from-slate-950 dark:to-slate-900 border-white text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Execute Workflow</DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to execute this workflow?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPlayDialogOpen(false)}
                className="hover:bg-slate-800 hover:text-white bg-transparent border-white text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={executeWorkflow}
                className="hover:bg-green-700 bg-green-600 text-white border-white"
              >
                Execute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </div>
  );
}
