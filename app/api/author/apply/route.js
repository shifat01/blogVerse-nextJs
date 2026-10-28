import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import userModel from "@/lib/models/userModel";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first",
                },
                { status: 401 }
            );
        }

        await ConnectDB();

        const user = await userModel.findById(currentUser.userId);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.role === "author") {
            return NextResponse.json({
                success: true,
                message: "You are already an author",
            });
        }

        user.role = "author";
        await user.save();

        return NextResponse.json({
            success: true,
            message: "You are now an author!",
        });
    } catch (error) {
        console.error("Become author error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}