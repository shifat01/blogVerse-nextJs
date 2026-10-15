import { NextResponse } from "next/server";
import {ConnectDB} from "@/lib/config/db";
import userModel from "@/lib/models/userModel";
import { getCurrentUser } from "@/lib/auth";

export async function GET(){
    try{
        const payload = await getCurrentUser();

        if(!payload?.userId){
            return NextResponse.json(
                {success: false, message: "Not authenticated"},
                {status: 401}
            );
        }

        await ConnectDB();

        const user = await userModel.findById(payload.userId).select("-password");

        if(!user){
            return NextResponse.json(
                {success: false, message: "user not found"},
                {status: 401}
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

       } catch(error){
            console.error("Get current user error:", error);

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went wrong",
                },
                { status: 500 }
            );
       }
    }