/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext, ExecutionResult, WorkflowNode } from "../types";
import { executeTriggerNode } from "./executors/trigger-executor";
import { executeDataNode } from "./executors/data-executor";
import { executeLogicNode } from "./executors/logic-executor";
import { executeActionNode } from "./executors/action-executor";

type DBWorkflow = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  nodes: Array<{
    id: string;
    workflowId: string;
    type: string;
    subType: string;
    label: string | null;
    config: string;
    positionX: number;
    positionY: number;
  }>;
  connections: Array<{
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle: string;
    targetHandle: string;
  }>;
};

export async function executeWorkflow(
  workflow: DBWorkflow,
  triggerData?: any
): Promise<ExecutionResult> {
  const nodes: WorkflowNode[] = workflow.nodes.map((node) => ({
    id: node.id,
    type: node.type as any,
    subType: node.subType as any,
    label: node.label || undefined,
    config: JSON.parse(node.config),
    position: { x: node.positionX, y: node.positionY },
  }));

  const connections = workflow.connections.map((conn) => ({
    id: conn.id,
    source: conn.sourceNodeId,
    target: conn.targetNodeId,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
  }));

  const executionOrder = topologicalSort(nodes, connections);

  if (!executionOrder) {
    return {
      success: false,
      error: "Workflow contains cycles or invalid connections",
      outputs: {},
      executedNodes: [],
    };
  }

  const context: ExecutionContext = {
    workflowId: workflow.id,
    triggerData,
    nodeOutputs: new Map(),
    variables: new Map(),
  };

  const executedNodes: string[] = [];
  const outputs: Record<string, any> = {};

  try {
    for (const nodeId of executionOrder) {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      console.log(`Executing node: ${node.id} (${node.type}/${node.subType})`);

      const nodeOutput = await executeNode(node, context);

      context.nodeOutputs.set(node.id, nodeOutput);
      outputs[node.id] = nodeOutput;
      executedNodes.push(node.id);
    }

    return {
      success: true,
      outputs,
      executedNodes,
    };
  } catch (error) {
    console.error("Error during workflow execution:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      outputs,
      executedNodes,
    };
  }
}

async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  switch (node.type) {
    case "trigger":
      return executeTriggerNode(node, context);
    case "data":
      return executeDataNode(node, context);
    case "logic":
      return executeLogicNode(node, context);
    case "action":
      return executeActionNode(node, context);
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function topologicalSort(
  nodes: WorkflowNode[],
  connections: Array<{ source: string; target: string }>
): string[] | null {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const conn of connections) {
    graph.get(conn.source)?.push(conn.target);
    inDegree.set(conn.target, (inDegree.get(conn.target) || 0) + 1);
  }

  const queue: string[] = [];
  const result: string[] = [];

  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== nodes.length) {
    return null;
  }

  return result;
}
