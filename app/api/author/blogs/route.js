import { getCurrentUser } from "@/lib/auth";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import userModel from "@/lib/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        const payload = await getCurrentUser();

        if(!payload?.userId){
            return NextResponse.json(
                {success: false, message: "Please login first"},
                {status: 401}
            );
        }

        await ConnectDB();

        const currentAuthor = await userModel.findById(payload.userId).select("-password");

        if(!currentAuthor){
            return NextResponse.json(
                {success: false, message: "Author not found"},
                {status: 401}
            );
        }

        if(currentAuthor.role !== "author"){
            return NextResponse.json(
                {success: false, message: "You are not author"},
                {status: 403}
            );
        }

        const currentAuthorBlogs = await BlogModel.find({authorId: currentAuthor._id});

        if(!currentAuthorBlogs){
            return NextResponse.json(
                {success: false, message: "No blog found"}
            );
        }

        return NextResponse.json(
            {
                success: true,
                blogs: currentAuthorBlogs
            }
        )
    } catch(error){
        console.error("author blogs error: ", error);
        return NextResponse.json(
            {success: false, message: "something went wrong"},
            {status: 500}
        );
    }
}