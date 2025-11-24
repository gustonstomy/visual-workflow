import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  nodes: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.string(),
        subType: z.string(),
        label: z.string().optional(),
        config: z.any(),
        positionX: z.number(),
        positionY: z.number(),
      })
    )
    .optional(),
  connections: z
    .array(
      z.object({
        id: z.string().optional(),
        sourceNodeId: z.string(),
        targetNodeId: z.string(),
        sourceHandle: z.string().optional(),
        targetHandle: z.string().optional(),
      })
    )
    .optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
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

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const validatedData = updateWorkflowSchema.parse(body);

    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: { nodes: true, connections: true },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (validatedData.nodes !== undefined) {
        await tx.node.deleteMany({
          where: { workflowId: params.id },
        });

        if (validatedData.nodes.length > 0) {
          await tx.node.createMany({
            data: validatedData.nodes.map((node) => ({
              id: node.id,
              workflowId: params.id,
              type: node.type,
              subType: node.subType,
              label: node.label,
              config: JSON.stringify(node.config),
              positionX: node.positionX,
              positionY: node.positionY,
            })),
          });
        }
      }

      if (validatedData.connections !== undefined) {
        await tx.connection.deleteMany({
          where: { workflowId: params.id },
        });

        if (validatedData.connections.length > 0) {
          await tx.connection.createMany({
            data: validatedData.connections.map((conn) => ({
              id: conn.id,
              workflowId: params.id,
              sourceNodeId: conn.sourceNodeId,
              targetNodeId: conn.targetNodeId,
              sourceHandle: conn.sourceHandle || "output",
              targetHandle: conn.targetHandle || "input",
            })),
          });
        }
      }

      await tx.workflow.update({
        where: { id: params.id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          isActive: validatedData.isActive,
        },
      });
    });

    const updatedWorkflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: {
        nodes: true,
        connections: true,
      },
    });

    return NextResponse.json(updatedWorkflow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.workflow.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workflow:", error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 }
    );
  }
}
