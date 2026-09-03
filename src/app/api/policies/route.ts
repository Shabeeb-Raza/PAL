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

export async function GET() {
  const policies = await loadPolicies();
  return NextResponse.json({ policies });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const policies = await loadPolicies();

    const newPolicy: Policy = {
      id: `policy_${Date.now()}`,
      name: body.name,
      category: body.category,
      type: body.type,
      params: body.params || {},
      severity: body.severity || "fail",
      enabled: body.enabled !== false,
      priority: body.priority || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    policies.push(newPolicy);
    await savePolicies(policies);

    return NextResponse.json({ policy: newPolicy }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create policy" },
      { status: 400 }
    );
  }
}
