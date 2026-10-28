import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { ConnectDB } from "@/lib/config/db";
import userModel from "@/lib/models/userModel";
import { sendEmail } from "@/lib/config/mailer";

export async function POST(request){
    let user;

    try{
        const {email} = await request.json();

        if(!email || typeof email !== "string"){
            return NextResponse.json(
                {success: false, message: "Please enter your email"},
                {status: 400}
            );
        }

        await ConnectDB();

        user = await userModel.findOne({
            email: email.trim().toLowerCase()
        });

        if(!user){
            return NextResponse.json(
                {success: true, message: "If an account exists with this email, a reset link will be sent."}
            );
        }

        const resetToken = randomBytes(32).toString("hex");

        const hashedToken = createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const baseUrl = process.env.APP_URL;

        if(!baseUrl){
            throw new Error("APP_URL is not configured");
        }

        const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Reset Your BlogVerse Password",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Reset Your Password</h2>
                        <p>We received a request to reset your BlogVerse password.</p>
                        <p>
                            <a href="${resetUrl}"
                               style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
                                Reset Password
                            </a>
                        </p>
                        <p>This link expires in 15 minutes and can only be used once.</p>
                        <p>If you did not request this, you can ignore this email.</p>
                    </div>
                `,
            });
        } catch (emailError) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            throw emailError;
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, a reset link will be sent.",
        });
    } catch(error){
        console.error("Forgot password error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to process your request right now",
            },
            { status: 500 }
        );
    }
}