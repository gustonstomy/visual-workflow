/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext } from "../types";

/**
 * Interpolates variables in text using data from the execution context.
 * Supports:
 * - {{nodeId}} - Full output from a specific node
 * - {{nodeId.field}} - Specific field from a node's output
 * - {{nodeId.field.nested}} - Nested field access
 * - {{previous}} - Output from the immediately preceding node
 * - {{trigger}} - Data from the workflow trigger
 */
export function interpolateVariables(
  text: string,
  context: ExecutionContext,
  currentNodeId?: string
): string {
  let result = text;

  // Handle {{previous}} and {{previous.field}}
  const nodeOutputsArray = Array.from(context.nodeOutputs.entries());
  if (nodeOutputsArray.length > 0) {
    // Get the last node that's not the current node
    let previousOutput = nodeOutputsArray[nodeOutputsArray.length - 1][1];

    // If current node is provided, find the actual previous node
    if (currentNodeId && nodeOutputsArray.length > 1) {
      const currentIndex = nodeOutputsArray.findIndex(
        ([id]) => id === currentNodeId
      );
      if (currentIndex > 0) {
        previousOutput = nodeOutputsArray[currentIndex - 1][1];
      }
    }

    // Handle {{previous.field}} and {{previous.field.nested}}
    const previousPattern = /\{\{previous(?:\.([^}]+))?\}\}/g;
    result = result.replace(previousPattern, (match, path) => {
      if (!path) {
        // {{previous}} - return full output
        return formatOutput(previousOutput);
      } else {
        // {{previous.field}} or {{previous.field.nested}} - return specific field
        const value = getNestedValue(previousOutput, path);
        return formatOutput(value);
      }
    });
  }

  // Handle {{trigger}}
  if (context.triggerData) {
    result = result.replace(
      /\{\{trigger\}\}/g,
      formatOutput(context.triggerData)
    );
  }

  // Handle {{nodeId}} and {{nodeId.field.nested}}
  context.nodeOutputs.forEach((output, nodeId) => {
    // Match patterns like {{nodeId}}, {{nodeId.field}}, {{nodeId.field.nested}}
    const pattern = new RegExp(
      `\\{\\{${escapeRegex(nodeId)}(?:\\.([^}]+))?\\}\\}`,
      "g"
    );

    result = result.replace(pattern, (match, path) => {
      if (!path) {
        // {{nodeId}} - return full output
        return formatOutput(output);
      } else {
        // {{nodeId.field}} or {{nodeId.field.nested}} - return specific field
        const value = getNestedValue(output, path);
        return formatOutput(value);
      }
    });
  });

  return result;
}

/**
 * Gets a nested value from an object using dot notation
 * e.g., getNestedValue({a: {b: {c: 1}}}, "a.b.c") returns 1
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Formats output for interpolation
 */
function formatOutput(value: any): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  // For objects and arrays, return JSON
  return JSON.stringify(value, null, 2);
}

/**
 * Escapes special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Gets a helper function to create data reference buttons in UI
 */
export function getAvailableDataSources(
  context: ExecutionContext
): Array<{ id: string; label: string; data: any }> {
  const sources: Array<{ id: string; label: string; data: any }> = [];

  // Add previous nodes
  context.nodeOutputs.forEach((output, nodeId) => {
    sources.push({
      id: nodeId,
      label: `Node: ${nodeId.substring(0, 8)}...`,
      data: output,
    });
  });

  // Add trigger data if available
  if (context.triggerData) {
    sources.push({
      id: "trigger",
      label: "Trigger Data",
      data: context.triggerData,
    });
  }

  return sources;
}
