"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/auth/me");

            if (response.data.success && response.data.user) {
                setUser(response.data.user);
            } else {
                router.replace("/login");
            }
        } catch (error) {
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const becomeAuthor = async () => {
        try {
            setUpgrading(true);     

            const response = await axios.post("/api/author/apply");

            if (response.data.success) {
                toast.success(response.data.message || "You are now an author!");
                await fetchUser();
            } else {
                toast.error(response.data.message || "Could not become an author.");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        } finally {
            setUpgrading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (!user) return null;

    const isAuthor = user.role === "author";

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-3xl">

                {/* Profile Header */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-3xl font-semibold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </h1>

                            <p className="mt-1 text-gray-500">
                                {user.email}
                            </p>

                            <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-700">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Account Information */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Account Information
                    </h2>

                    <div className="mt-5 space-y-4">
                        <div className="border-b border-gray-100 pb-4">
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="mt-1 font-medium text-gray-900">
                                {user.name}
                            </p>
                        </div>

                        <div className="border-b border-gray-100 pb-4">
                            <p className="text-sm text-gray-500">
                                Email Address
                            </p>
                            <p className="mt-1 break-all font-medium text-gray-900">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Account Role
                            </p>
                            <p className="mt-1 font-medium capitalize text-gray-900">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Role-Based Actions */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {isAuthor ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Author Dashboard
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Manage your blogs and publish new content.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/author/blogList"
                                    className="rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white transition hover:bg-gray-700"
                                >
                                    My Blogs
                                </Link>

                                <Link
                                    href="/author/addProduct"
                                    className="rounded-lg border border-gray-300 px-5 py-3 text-center font-medium text-gray-800 transition hover:bg-gray-100"
                                >
                                    Create a Blog
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Become an Author
                            </h2>

                            <p className="mt-2 leading-7 text-gray-500">
                                Want to share your knowledge and ideas?
                                Become an author and start publishing your
                                own blogs on BlogVerse.
                            </p>

                            <button
                                onClick={becomeAuthor}
                                disabled={upgrading}
                                className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {upgrading
                                    ? "Processing..."
                                    : "Become an Author"}
                            </button>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;