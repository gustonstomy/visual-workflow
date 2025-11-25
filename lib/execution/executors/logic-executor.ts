import {
  WorkflowNode,
  ExecutionContext,
  FilterLogicConfig,
  TransformLogicConfig,
  ConditionLogicConfig,
  AILogicConfig,
} from "../../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function executeLogicNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  console.log(`Executing logic node: ${node.subType}`);

  switch (node.subType) {
    case "filter":
      return executeFilter(node, context);

    case "transform":
      return executeTransform(node, context);

    case "condition":
      return executeCondition(node, context);

    case "ai":
      return await executeAI(node, context);

    default:
      throw new Error(`Unknown logic node type: ${node.subType}`);
  }
}

function executeFilter(node: WorkflowNode, context: ExecutionContext): any {
  const config = node.config as FilterLogicConfig;
  const previousOutputs = Array.from(context.nodeOutputs.values());

  if (previousOutputs.length === 0) {
    return { filtered: [], matched: false };
  }

  const lastOutput = previousOutputs[previousOutputs.length - 1];

  if (Array.isArray(lastOutput)) {
    const filtered = lastOutput.filter((item) => {
      const value = item[config.field];
      return evaluateCondition(value, config.operator, config.value);
    });

    return { filtered, matched: filtered.length > 0, count: filtered.length };
  }

  const value = lastOutput[config.field];
  const matched = evaluateCondition(value, config.operator, config.value);

  return { matched, data: matched ? lastOutput : null };
}

function executeTransform(node: WorkflowNode, context: ExecutionContext): any {
  const config = node.config as TransformLogicConfig;
  const previousOutputs = Array.from(context.nodeOutputs.values());

  if (previousOutputs.length === 0) {
    return {};
  }

  const lastOutput = previousOutputs[previousOutputs.length - 1];

  try {
    const transformedData = {
      ...lastOutput,
      transformed: true,
      transformedAt: new Date().toISOString(),
    };

    return transformedData;
  } catch (error) {
    console.error("Transform error:", error);
    return lastOutput;
  }
}

function executeCondition(node: WorkflowNode, context: ExecutionContext): any {
  const config = node.config as ConditionLogicConfig;
  const previousOutputs = Array.from(context.nodeOutputs.values());

  if (previousOutputs.length === 0) {
    return { condition: false, branch: "false", output: config.falseOutput };
  }

  const lastOutput = previousOutputs[previousOutputs.length - 1];
  const value = lastOutput[config.field];
  const condition = evaluateCondition(value, config.operator, config.value);

  return {
    condition,
    branch: condition ? "true" : "false",
    output: condition ? config.trueOutput : config.falseOutput,
  };
}

async function executeAI(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  const config = node.config as AILogicConfig;

  // Check for Gemini preference or fallback
  if (
    config.provider === "gemini" ||
    (!process.env.OPENAI_API_KEY && process.env.GEMINI_API_KEY)
  ) {
    return executeGemini(config, context);
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OpenAI API key not configured, returning mock response");
    return {
      response: `AI-generated response for: ${config.prompt}`,
      mock: true,
    };
  }

  try {
    const previousOutputs = Array.from(context.nodeOutputs.values());
    const contextData =
      previousOutputs.length > 0
        ? JSON.stringify(previousOutputs[previousOutputs.length - 1])
        : "";

    const fullPrompt = contextData
      ? `${config.prompt}\n\nContext data: ${contextData}`
      : config.prompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: fullPrompt }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0]?.message?.content || "",
      model: config.model || "gpt-3.5-turbo",
    };
  } catch (error) {
    console.error("AI execution error:", error);
    throw error;
  }
}

async function executeGemini(
  config: AILogicConfig,
  context: ExecutionContext
): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key not configured, returning mock response");
    return {
      response: `AI-generated response for: ${config.prompt}`,
      mock: true,
      provider: "gemini",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: config.model || "gemini-pro",
    });

    const previousOutputs = Array.from(context.nodeOutputs.values());
    const contextData =
      previousOutputs.length > 0
        ? JSON.stringify(previousOutputs[previousOutputs.length - 1])
        : "";

    const fullPrompt = contextData
      ? `${config.prompt}\n\nContext data: ${contextData}`
      : config.prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      response: text,
      model: config.model || "gemini-pro",
      provider: "gemini",
    };
  } catch (error) {
    console.error("Gemini AI execution error:", error);
    throw error;
  }
}

function evaluateCondition(
  value: any,
  operator: string,
  compareValue: string | number
): boolean {
  switch (operator) {
    case "equals":
      return value == compareValue;
    case "contains":
      return String(value).includes(String(compareValue));
    case "greaterThan":
      return Number(value) > Number(compareValue);
    case "lessThan":
      return Number(value) < Number(compareValue);
    default:
      return false;
  }
}
