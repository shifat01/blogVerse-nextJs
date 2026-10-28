"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/forgot-password",
                { email: email.trim() }
            );

            if (data.success) {
                setSubmitted(true);
                toast.success(data.message);
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to process your request"
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
                        ✉
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Forgot Password?
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Enter your registered email address and we will
                        send you a password reset link.
                    </p>
                </div>

                {submitted ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                        <h2 className="font-semibold text-green-800">
                            Check your email
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-green-700">
                            If an account exists with this email, a reset
                            link will be sent. Please check your inbox.
                        </p>

                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </main>
    );
}