/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNode as NodePalette } from "@/components/workflow/node-palette";
import { NodeConfigPanel } from "@/components/workflow/node-config-panel";
import { CustomNode } from "@/components/workflow/custom-node";
import { nanoid } from "nanoid";

const nodeTypes = {
  custom: CustomNode,
};

type WorkflowEditorProps = {
  params: Promise<{ id: string }>;
};

export default function WorkflowEditor({ params }: WorkflowEditorProps) {
  const router = useRouter();
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const initWorkflow = async () => {
      const resolvedParams = await params;
      setWorkflowId(resolvedParams.id);
      loadWorkflow(resolvedParams.id);
    };
    initWorkflow();
  }, [params]);

  const loadWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/workflows/${id}`);
      const workflow = await response.json();

      setWorkflowName(workflow.name);

      const loadedNodes = workflow.nodes.map((node: any) => ({
        id: node.id,
        type: "custom",
        position: { x: node.positionX, y: node.positionY },
        data: {
          nodeType: node.type,
          subType: node.subType,
          label: node.label || `${node.subType}`,
          config: JSON.parse(node.config),
        },
      }));

      const loadedEdges = workflow.connections.map((conn: any) => ({
        id: conn.id,
        source: conn.sourceNodeId,
        target: conn.targetNodeId,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
      }));

      setNodes(loadedNodes);
      setEdges(loadedEdges);
    } catch (error) {
      console.error("Error loading workflow:", error);
    }
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeData = event.dataTransfer.getData("application/reactflow");
      if (!nodeData) return;

      const { nodeType, subType } = JSON.parse(nodeData);
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 75,
        y: event.clientY - bounds.top - 25,
      };

      const newNode: Node = {
        id: nanoid(),
        type: "custom",
        position,
        data: {
          nodeType,
          subType,
          label: subType,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeConfigChange = useCallback(
    (nodeId: string, newConfig: any, newLabel?: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config: newConfig,
                  label: newLabel || node.data.label,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const saveWorkflow = async () => {
    if (!workflowId) return;

    setSaving(true);
    try {
      const workflowNodes = nodes.map((node) => ({
        id: node.id,
        type: node.data.nodeType,
        subType: node.data.subType,
        label: node.data.label,
        config: node.data.config,
        positionX: node.position.x,
        positionY: node.position.y,
      }));

      const workflowConnections = edges.map((edge) => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourceHandle: edge.sourceHandle || "output",
        targetHandle: edge.targetHandle || "input",
      }));

      await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: workflowNodes,
          connections: workflowConnections,
        }),
      });

      alert("Workflow saved successfully!");
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!workflowId) return;

    setExecuting(true);
    try {
      await saveWorkflow();

      const response = await fetch(`/api/execute/${workflowId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        alert("Workflow executed successfully!");
        console.log("Execution results:", result.outputs);
      } else {
        alert(`Execution failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error executing workflow:", error);
      alert("Failed to execute workflow");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <NodePalette />

      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/workflows")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{workflowName}</h1>
              <p className="text-sm text-slate-500">Workflow Editor</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveWorkflow} disabled={saving} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button onClick={executeWorkflow} disabled={executing}>
              <Play className="w-4 h-4 mr-2" />
              {executing ? "Running..." : "Run Workflow"}
            </Button>
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>

          {selectedNode && (
            <NodeConfigPanel
              node={selectedNode}
              nodes={nodes}
              edges={edges}
              onConfigChange={handleNodeConfigChange}
              onDelete={handleNodeDelete}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
