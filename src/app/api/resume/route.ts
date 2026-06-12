import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/resume — List all resumes for the user
// GET /api/resume?id=xxx — Get a single resume
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    // Get single resume
    const resume = await prisma.resume.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ resume });
  }

  // List all resumes
  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      template: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ resumes });
}

// POST /api/resume — Create or update a resume
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, name, template, data } = body;

  if (!name || !template || !data) {
    return NextResponse.json({ error: "name, template, and data are required" }, { status: 400 });
  }

  if (id) {
    // Update existing
    const existing = await prisma.resume.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    const updated = await prisma.resume.update({
      where: { id },
      data: { name, template, data },
    });
    return NextResponse.json({ resume: updated });
  }

  // Create new
  const created = await prisma.resume.create({
    data: {
      userId: session.user.id,
      name,
      template,
      data,
    },
  });
  return NextResponse.json({ resume: created }, { status: 201 });
}

// DELETE /api/resume?id=xxx — Delete a resume
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }

  const existing = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
