import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { ConnectDB } from "@/lib/config/db";
import userModel from "@/lib/models/userModel";

export async function POST(request){
    try{
        const {token, password} = await request.json();

        if (
            typeof token !== "string" ||
            !token ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid token and password of at least 8 characters are required",
                },
                { status: 400 }
            );
        }

        await ConnectDB();

        const hashedToken = createHash("sha256").update(token).digest("hex");

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Reset link is invalid or has expired",
                },
                { status: 400 }
            );
        }

        user.password = await bcrypt.hash(password, 12);

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successfully. Please login with your new password.",
        });
    } catch(error){
        console.error("Reset password error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to reset password right now",
            },
            { status: 500 }
        );
    }
}