import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {ConnectDB} from "@/lib/config/db";
import userModel from "@/lib/models/userModel";
import { createToken } from "@/lib/auth";

export async function POST(request){
    try{
        await ConnectDB();

        const {name, email, password} = await request.json();

        // validate input
        if(!name?.trim() || !email?.trim() || !password){
            return NextResponse.json(
                {success: false, masseage: "All feilds are required"},
                {status: 400}
            );
        }

        if(password.length < 8){
            return NextResponse.json(
                {success: false, message: "Password must be at least 8 characters"},
                {status: 400}
            );
        }

        // normalize email
        const normalizeEmail = email.trim().toLowerCase();

        // check existing user
        const existingUser = await userModel.findOne({email: normalizeEmail});

        if(existingUser){
            return NextResponse.json(
                {success: false, message: "Email already registered"},
                {status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Public signup always creates a normal user
        const user = await userModel.create({
            name: name.trim(),
            email: normalizeEmail,
            password: hashedPassword,
            role: "user"
        });

        // create jwt
        const token = await createToken({
            userId: user._id.toString(),
            role: user.role
        });

        const response = NextResponse.json(
            {
                success: true,
                message: "Account Created Successfully",
                user: {
                    id: user._id.toString(),
                    name: user.name.trim(),
                    email: user.email,
                    role: user.role,
                },
            },
            {status: 201}
        );

        // store jwt in cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return response;
    } catch (error) {
        
    // Handle duplicate email if two requests race
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}