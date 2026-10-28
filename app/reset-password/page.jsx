"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/reset-password",
                {
                    token,
                    password,
                }
            );

            if (data.success) {
                toast.success(data.message);

                setTimeout(() => {
                    router.push("/login");
                }, 1200);
            } else {
                toast.error(data.message || "Unable to reset password");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Reset link is invalid or has expired"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <Link
                    href="/"
                    className="mb-8 block text-center text-2xl font-bold tracking-tight text-gray-900"
                >
                    Blog<span className="text-blue-600">Verse</span>
                </Link>

                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                        🔒
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Reset Password
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Choose a new password for your BlogVerse account.
                    </p>
                </div>

                {!token ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                        <p className="text-sm text-red-700">
                            The reset link is missing or invalid. Please
                            request a new password reset link.
                        </p>

                        <Link
                            href="/forgot-password"
                            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
                        >
                            Request a new link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                New password
                            </label>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Confirm new password
                            </label>

                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Enter the password again"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            Show passwords
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-[80vh] items-center justify-center">
                    <p className="text-gray-500">Loading reset form...</p>
                </main>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}