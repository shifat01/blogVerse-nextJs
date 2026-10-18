import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDB } from "@/lib/config/db";
import userModel from "@/lib/models/userModel";
import { createToken } from "@/lib/auth";

export async function POST(request){
    try{
        await ConnectDB();

        const {email, password} = await request.json();

        if(!email?.trim() || !password){
            return NextResponse.json(
                {success: false, message: "Email and password are required"},
                {status: 400}
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await userModel.findOne({email: normalizedEmail});

        if(!user){
            return NextResponse.json(
                {success: false, message: "Invalid email or password"},
                {status: 401}
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return NextResponse.json(
                {success: false, message: "Invalid email or password"},
                {status: 401}
            );
        }

        const token = await createToken({
            userId: user._id.toString(),
            role: user.role
        });

        const response = NextResponse.json(
            {
                success: true, 
                message: "Login successful",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role:  user.role
                }
            }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return response;

    } catch(error){
        console.error("Login error:", error);

        return NextResponse.json(
        {
            success: false,
            message: "Something went wrong",
        },
        { status: 500 }
        );
    }
}