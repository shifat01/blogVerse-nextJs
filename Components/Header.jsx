"use client";

import { assets } from "@/Assets/assets";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // verify user logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");

        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post("/api/auth/logout");

      setUser(null);

      toast.success("Logged out successfully");

      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Email subscribe
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post("/api/email", formData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      {/* Navbar */}
      <div className="flex justify-between items-center gap-4">
        {/* Navbar logo */}
        <Link href="/">
          <Image
            src={assets.logo}
            width={180}
            alt="BlogVerse logo"
            className="w-32.5 sm:w-auto"
          />
        </Link>

        {/* Authentication buttons */}
        <div className="flex items-center gap-3">
          {checkingAuth ? (
            <span className="text-sm">Loading...</span>
          ) : user ? (
            <>
              <span className="hidden sm:inline text-sm font-medium">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 font-medium py-2 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000] disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium py-2 px-3"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-2 font-medium py-2 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]"
              >
                Sign Up
                <Image src={assets.arrow} alt="" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Latest Blogs */}
      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">
          Latest Blogs
        </h1>

        <p className="mt-10 max-w-185 m-auto text-xs sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Consectetur nobis magnam minus eius sapiente, repellat
          rerum in id aliquid repellendus?
        </p>

        {/* Subscribe by Email */}
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-125 scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Enter Your Email"
            className="pl-4 outline-none min-w-0 flex-1"
          />

          <button
            type="submit"
            className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;