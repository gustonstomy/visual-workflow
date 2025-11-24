import { WorkflowNode, ExecutionContext, EmailActionConfig } from "../../types";

export async function executeActionNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  console.log(`Executing action node: ${node.subType}`);

  switch (node.subType) {
    case "email":
      return await sendEmail(node.config as EmailActionConfig, context);

    case "sms":
      return await sendSMS(node.config, context);

    case "webhook":
      return await sendWebhook(node.config, context);

    case "social":
      return await postToSocial(node.config, context);

    case "notification":
      return sendNotification(node.config, context);

    default:
      throw new Error(`Unknown action node type: ${node.subType}`);
  }
}

async function sendEmail(
  config: EmailActionConfig,
  context: ExecutionContext
): Promise<any> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("Email API key not configured, simulating email send");
    return {
      success: true,
      simulated: true,
      to: config.to,
      subject: config.subject,
      message: "Email would be sent (no API key configured)",
    };
  }

  try {
    const body = interpolateVariables(config.body, context);
    const subject = interpolateVariables(config.subject, context);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: config.from || "workflow@example.com",
        to: config.to,
        subject,
        html: `<div>${body}</div>`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      emailId: data.id,
      to: config.to,
      subject,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function sendSMS(config: any, context: ExecutionContext): Promise<any> {
  console.warn("SMS integration not implemented, simulating");
  return {
    success: true,
    simulated: true,
    to: config.to,
    message: "SMS would be sent",
  };
}

async function sendWebhook(
  config: any,
  context: ExecutionContext
): Promise<any> {
  try {
    const payload = {
      workflowId: context.workflowId,
      timestamp: new Date().toISOString(),
      data: Array.from(context.nodeOutputs.values()),
    };

    const response = await fetch(config.url, {
      method: config.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(payload),
    });

    return {
      success: response.ok,
      status: response.status,
      url: config.url,
    };
  } catch (error) {
    console.error("Webhook error:", error);
    throw error;
  }
}

async function postToSocial(
  config: any,
  context: ExecutionContext
): Promise<any> {
  console.warn("Social media posting not implemented, simulating");

  const message = interpolateVariables(
    config.message || config.content || "",
    context
  );

  return {
    success: true,
    simulated: true,
    platform: config.platform || "twitter",
    message,
    posted: "Social media post would be created",
  };
}

function sendNotification(config: any, context: ExecutionContext): any {
  const message = interpolateVariables(config.message || "", context);

  console.log(
    `[NOTIFICATION] ${config.title || "Workflow Notification"}: ${message}`
  );

  return {
    success: true,
    title: config.title || "Workflow Notification",
    message,
    timestamp: new Date().toISOString(),
  };
}

function interpolateVariables(text: string, context: ExecutionContext): string {
  let result = text;

  context.nodeOutputs.forEach((output, nodeId) => {
    const placeholder = new RegExp(`{{${nodeId}}}`, "g");
    result = result.replace(placeholder, JSON.stringify(output));
  });

  if (context.triggerData) {
    const placeholderstrigger = /{{trigger}}/g;
    result = result.replace(
      placeholderstrigger,
      JSON.stringify(context.triggerData)
    );
  }

  return result;
}
