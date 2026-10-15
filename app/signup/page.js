"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const data = response.data;

      setSuccess(data.message || "Account created successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error.response?.data?.masseage ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border p-6">
      <h1 className="mb-6 text-2xl font-bold">Create an Account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded border p-2"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border p-2"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded border p-2"
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600" role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Login
        </a>
      </p>
    </div>
  );
}
