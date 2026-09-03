"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SEEDED_USER = {
  email: "admin@iobm.edu",
  password: "admin123",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === SEEDED_USER.email && password === SEEDED_USER.password) {
      document.cookie = "pal_auth=true; path=/; max-age=86400";
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">PAL Portal</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Student Advisory System — Faculty Login
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="admin@iobm.edu"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo: admin@iobm.edu / admin123
        </p>
      </div>
    </div>
  );
}
