/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  WorkflowNode,
  ExecutionContext,
  ScheduleTriggerConfig,
} from "../../types";

export async function executeTriggerNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  console.log(`Executing trigger node: ${node.subType}`);

  switch (node.subType) {
    case "manual":
      return (
        context.triggerData || {
          triggered: true,
          timestamp: new Date().toISOString(),
        }
      );

    case "schedule":
      const scheduleConfig = node.config as ScheduleTriggerConfig;
      return {
        triggered: true,
        timestamp: new Date().toISOString(),
        schedule: scheduleConfig.schedule,
      };

    case "webhook":
      return (
        context.triggerData || {
          triggered: true,
          timestamp: new Date().toISOString(),
        }
      );

    default:
      throw new Error(`Unknown trigger type: ${node.subType}`);
  }
}
