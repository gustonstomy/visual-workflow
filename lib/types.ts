// Node types and configurations

export type NodeType = "trigger" | "action" | "data" | "logic";

export type TriggerSubType = "manual" | "schedule" | "webhook";
export type ActionSubType =
  | "email"
  | "sms"
  | "webhook"
  | "social"
  | "notification"
  | "sheet";
export type DataSubType = "weather" | "github" | "calendar" | "http";
export type LogicSubType = "filter" | "transform" | "condition" | "ai";

export type NodeSubType =
  | TriggerSubType
  | ActionSubType
  | DataSubType
  | LogicSubType;

// Configuration types for different node types

export interface BaseNodeConfig {
  [key: string]: any;
}

export interface ScheduleTriggerConfig extends BaseNodeConfig {
  cronExpression?: string;
  schedule?: {
    type: "daily" | "weekly" | "monthly" | "custom";
    time?: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for Sunday-Saturday
    dayOfMonth?: number; // 1-31
  };
}

export interface WebhookTriggerConfig extends BaseNodeConfig {
  webhookUrl?: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
}

export interface EmailActionConfig extends BaseNodeConfig {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export interface WeatherDataConfig extends BaseNodeConfig {
  location: string;
  units?: "metric" | "imperial";
}

export interface GitHubDataConfig extends BaseNodeConfig {
  repository: string;
  owner: string;
  type?: "commits" | "issues" | "prs";
  since?: string;
}

export interface GoogleCalendarDataConfig extends BaseNodeConfig {
  calendarId: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
}

export interface SheetActionConfig extends BaseNodeConfig {
  spreadsheetId: string;
  range: string;
  values: string[]; // Array of values for a row
  action: "append" | "update";
}

export interface HTTPDataConfig extends BaseNodeConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
}

export interface FilterLogicConfig extends BaseNodeConfig {
  field: string;
  operator: "equals" | "contains" | "greaterThan" | "lessThan";
  value: string | number;
}

export interface TransformLogicConfig extends BaseNodeConfig {
  transformExpression: string; // Simple transformation logic
}

export interface ConditionLogicConfig extends BaseNodeConfig {
  field: string;
  operator: "equals" | "contains" | "greaterThan" | "lessThan";
  value: string | number;
  trueOutput?: string;
  falseOutput?: string;
}

export interface AILogicConfig extends BaseNodeConfig {
  prompt: string;
  model?: string;
  provider?: "openai" | "gemini";
}

// Runtime node data
export interface WorkflowNode {
  id: string;
  type: NodeType;
  subType: NodeSubType;
  label?: string;
  config: BaseNodeConfig;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
}

// Execution context
export interface ExecutionContext {
  workflowId: string;
  triggerData?: any;
  nodeOutputs: Map<string, any>;
  variables: Map<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  error?: string;
  outputs: Record<string, any>;
  executedNodes: string[];
}
