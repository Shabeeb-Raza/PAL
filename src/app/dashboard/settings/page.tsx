"use client";

import { useEffect, useState } from "react";
import { Policy, PolicyCategory, PolicyType } from "@/types/policy";
import { POLICY_CATEGORIES } from "@/config/policy-categories";

export default function SettingsPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<PolicyCategory>("graduation");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  async function fetchPolicies() {
    try {
      const res = await fetch("/api/policies");
      const data = await res.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(policy: Partial<Policy>) {
    try {
      if (editingPolicy) {
        const res = await fetch(`/api/policies/${editingPolicy.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policy),
        });
        const data = await res.json();
        setPolicies((prev) =>
          prev.map((p) => (p.id === editingPolicy.id ? data.policy : p))
        );
      } else {
        const res = await fetch("/api/policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policy),
        });
        const data = await res.json();
        setPolicies((prev) => [...prev, data.policy]);
      }
      setShowAddForm(false);
      setEditingPolicy(null);
    } catch (error) {
      console.error("Failed to save policy:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/policies/${id}`, { method: "DELETE" });
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete policy:", error);
    }
  }

  async function handleToggle(id: string, enabled: boolean) {
    try {
      const res = await fetch(`/api/policies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? data.policy : p))
      );
    } catch (error) {
      console.error("Failed to toggle policy:", error);
    }
  }

  const categoryMeta = POLICY_CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryPolicies = policies.filter(
    (p) => p.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Policy Settings</h1>
        <p className="text-muted-foreground">
          Manage academic policies and rules
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {POLICY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setShowAddForm(false);
              setEditingPolicy(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {categoryMeta && (
        <p className="text-sm text-muted-foreground">
          {categoryMeta.description}
        </p>
      )}

      {/* Policies List */}
      <div className="space-y-3">
        {categoryPolicies.length === 0 && !showAddForm && (
          <p className="text-muted-foreground py-4">
            No policies in this category. Add one to get started.
          </p>
        )}

        {categoryPolicies.map((policy) => (
          <div
            key={policy.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{policy.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    policy.severity === "fail"
                      ? "bg-red-100 text-red-700"
                      : policy.severity === "warning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {policy.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {policy.type.replace(/_/g, " ")}:{" "}
                {JSON.stringify(policy.params)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(policy.id, !policy.enabled)}
                className={`px-3 py-1 rounded text-sm ${
                  policy.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {policy.enabled ? "Enabled" : "Disabled"}
              </button>
              <button
                onClick={() => {
                  setEditingPolicy(policy);
                  setShowAddForm(true);
                }}
                className="px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(policy.id)}
                className="px-3 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingPolicy(null);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Add Policy
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && categoryMeta && (
        <PolicyForm
          category={categoryMeta}
          existingPolicy={editingPolicy}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingPolicy(null);
          }}
        />
      )}
    </div>
  );
}

function PolicyForm({
  category,
  existingPolicy,
  onSave,
  onCancel,
}: {
  category: (typeof POLICY_CATEGORIES)[0];
  existingPolicy: Policy | null;
  onSave: (policy: Partial<Policy>) => void;
  onCancel: () => void;
}) {
  const [selectedType, setSelectedType] = useState<PolicyType>(
    existingPolicy?.type || category.types[0].id
  );
  const [name, setName] = useState(existingPolicy?.name || "");
  const [severity, setSeverity] = useState(
    existingPolicy?.severity || "fail"
  );
  const [params, setParams] = useState<Record<string, unknown>>(
    existingPolicy?.params || {}
  );

  const typeMeta = category.types.find((t) => t.id === selectedType);

  // Initialize params from defaults when type changes
  function handleTypeChange(type: PolicyType) {
    setSelectedType(type);
    const meta = category.types.find((t) => t.id === type);
    if (meta) {
      const defaults: Record<string, unknown> = {};
      meta.fields.forEach((f) => {
        if (f.defaultValue !== undefined) {
          defaults[f.key] = f.defaultValue;
        }
      });
      setParams(defaults);
      if (!name) {
        setName(meta.name);
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name,
      category: category.id,
      type: selectedType,
      params,
      severity,
      enabled: existingPolicy?.enabled ?? true,
      priority: existingPolicy?.priority || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
      <h3 className="font-semibold">
        {existingPolicy ? "Edit Policy" : "Add New Policy"}
      </h3>

      {/* Policy Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Policy Type</label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value as PolicyType)}
          className="w-full p-2 border rounded"
        >
          {category.types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Policy Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Policy Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Minimum CGPA for Graduation"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Dynamic Fields */}
      {typeMeta?.fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          {field.type === "number" && (
            <input
              type="number"
              step="0.1"
              value={(params[field.key] as number) ?? ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  [field.key]: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full p-2 border rounded"
              required={field.required}
            />
          )}
          {field.type === "text" && (
            <input
              type="text"
              value={(params[field.key] as string) ?? ""}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required={field.required}
            />
          )}
          {field.type === "boolean" && (
            <select
              value={String(params[field.key] ?? field.defaultValue)}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  [field.key]: e.target.value === "true",
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
          {field.type === "course" && (
            <input
              type="text"
              value={(params[field.key] as string) ?? ""}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              placeholder="e.g., CSC201"
              className="w-full p-2 border rounded"
              required={field.required}
            />
          )}
        </div>
      ))}

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium mb-1">Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as typeof severity)}
          className="w-full p-2 border rounded"
        >
          <option value="fail">Fail (blocks graduation)</option>
          <option value="warning">Warning (advisory only)</option>
          <option value="block">Block (prevents enrollment)</option>
          <option value="notify">Notify (sends alert)</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {existingPolicy ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-muted rounded hover:bg-muted/80"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
