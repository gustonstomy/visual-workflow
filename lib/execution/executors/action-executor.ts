/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  WorkflowNode,
  ExecutionContext,
  EmailActionConfig,
  SheetActionConfig,
} from "../../types";
import { google } from "googleapis";
import { transporter } from "../../email/templates/mail-transporter";
import { interpolateVariables } from "../interpolation";

export async function executeActionNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  console.log(`Executing action node: ${node.subType}`);

  switch (node.subType) {
    case "email":
      return await sendEmail(node.config as EmailActionConfig, context);

    case "sms":
      return await sendSMS(node.config);

    case "webhook":
      return await sendWebhook(node.config, context);

    case "social":
      return await postToSocial(node.config, context);

    case "notification":
      return sendNotification(node.config, context);

    case "sheet":
      return await writeToSheet(node.config as SheetActionConfig, context);

    default:
      throw new Error(`Unknown action node type: ${node.subType}`);
  }
}

async function sendEmail(
  config: EmailActionConfig,
  context: ExecutionContext
): Promise<any> {
  // Check if SMTP is configured (basic check)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured, simulating email send");
    return {
      success: true,
      simulated: true,
      to: config.to,
      subject: config.subject,
      message: "Email would be sent (no SMTP credentials configured)",
    };
  }

  try {
    // If body is empty, automatically use the previous node's output
    const bodyText =
      config.body && config.body.trim() ? config.body : "{{previous}}"; // Default to full previous node output
    const subjectText =
      config.subject && config.subject.trim()
        ? config.subject
        : "Workflow Result";

    const body = interpolateVariables(bodyText, context);
    const subject = interpolateVariables(subjectText, context);

    const info = await transporter.sendMail({
      from: config.from || process.env.SMTP_USER, // Use config from or default to SMTP user
      to: config.to,
      subject: subject,
      html: `<div>${body}</div>`,
    });

    return {
      success: true,
      messageId: info.messageId,
      to: config.to,
      subject,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function sendSMS(config: any): Promise<any> {
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

async function writeToSheet(
  config: SheetActionConfig,
  context: ExecutionContext
): Promise<any> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.warn("Google credentials not configured, simulating sheet write");
    return {
      success: true,
      simulated: true,
      spreadsheetId: config.spreadsheetId,
      range: config.range,
      values: config.values,
      action: config.action,
    };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Interpolate values
    const values = config.values.map((val) =>
      interpolateVariables(val, context)
    );

    if (config.action === "append") {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: config.range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      });
      return {
        success: true,
        updatedRange: response.data.updates?.updatedRange,
        updatedRows: response.data.updates?.updatedRows,
      };
    } else {
      // Update
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: config.range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      });
      return {
        success: true,
        updatedRange: response.data.updatedRange,
        updatedCells: response.data.updatedCells,
      };
    }
  } catch (error) {
    console.error("Error writing to sheet:", error);
    throw error;
  }
}
