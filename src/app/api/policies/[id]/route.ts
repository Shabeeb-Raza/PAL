import { NextResponse } from "next/server";
import { Policy } from "@/types/policy";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const POLICIES_FILE = join(process.cwd(), "data", "policies.json");

async function loadPolicies(): Promise<Policy[]> {
  try {
    const data = await readFile(POLICIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function savePolicies(policies: Policy[]): Promise<void> {
  await writeFile(POLICIES_FILE, JSON.stringify(policies, null, 2));
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const policies = await loadPolicies();
  const policy = policies.find((p) => p.id === params.id);

  if (!policy) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  return NextResponse.json({ policy });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const policies = await loadPolicies();
    const index = policies.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    policies[index] = {
      ...policies[index],
      ...body,
      id: params.id,
      updatedAt: new Date(),
    };

    await savePolicies(policies);

    return NextResponse.json({ policy: policies[index] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update policy" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const policies = await loadPolicies();
  const filtered = policies.filter((p) => p.id !== params.id);

  if (filtered.length === policies.length) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  await savePolicies(filtered);

  return NextResponse.json({ success: true });
}
