import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        nodes: true,
        connections: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createWorkflowSchema.parse(body);

    const workflow = await prisma.workflow.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
      include: {
        nodes: true,
        connections: true,
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}
