import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { executeWorkflow } from "@/lib/execution/engine";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { triggerData } = body;

    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: {
        nodes: true,
        connections: true,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    if (!workflow.isActive) {
      return NextResponse.json(
        { error: "Workflow is not active" },
        { status: 400 }
      );
    }

    const result = await executeWorkflow(workflow, triggerData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      {
        error: "Failed to execute workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
