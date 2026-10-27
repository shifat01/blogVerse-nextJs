import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises'
import BlogModel from "@/lib/models/BlogModel";
import { getCurrentUser } from "@/lib/auth";
import userModel from "@/lib/models/userModel";
import mongoose from "mongoose";
import path from "path";
import { unlink } from "fs/promises";

// const LoadDB = async () => {
//     await ConnectDB();
// }

// LoadDB();


// API Endpoint to get all blogs
export async function GET(request){

    await ConnectDB();

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
        return NextResponse.json(blog);
    }
    else{
        const blogs = await BlogModel.find({});

    return NextResponse.json({blogs});
    }

    
}


// API Endpoint For Uploading Blogs
export async function POST(request){

    try{
        const payload = await getCurrentUser();

    if(!payload?.userId){
        return NextResponse.json(
            {success: false, message: "Please Login first"},
            {status: 401}
        );
    }

    await ConnectDB();

    const currentUser = await userModel.findById(payload.userId).select("-password");

    if(!currentUser){
        return NextResponse.json(
            {success: false, message: "User not found"},
            {status: 401}
        );
    }

    if(currentUser.role !== "author"){
        return NextResponse.json(
            {success: false, message: "Only authors can create blogs"},
            {status: 403}
        );
    }


    const formData = await request.formData();
    
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");
    const authorImg = formData.get("authorImg");

    if(
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        typeof category !== "string" ||
        !category.trim() ||
        !(image instanceof File) ||
        image.size === 0
    ){
        return NextResponse.json(
            {success: false, message: "Please provide valid blog information and image"},
            {status: 400}
        );
    }

    const timestamp = Date.now();
    const imageName = `${timestamp}_${image.name}`;

    const imagePath = path.join(
        process.cwd(),
        "public",
        imageName
    );

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    await writeFile(imagePath, buffer);

    const imgUrl = `/${imageName}`;

    const blogData = {
        title: title.trim(),
        description,
        category: category.trim(),
        author: currentUser.name,
        authorId: currentUser._id,
        image: imgUrl,
        authorImg: typeof authorImg === "string"? authorImg: ""
    }

    await BlogModel.create(blogData);

    return NextResponse.json(
        {success: true, message: "Blog Added"},
    );


    } catch(error){
        console.error("Create blog error:", error);

        return NextResponse.json(
            {
                success: false,
                msg: "Failed to create blog",
            },
            { status: 500 }
        );
    }
}


// Creating API Endmoint to delete Blog

export async function DELETE(request){
    try{
        const payload = await getCurrentUser();
        
        if(!payload?.userId){
            return NextResponse.json(
                { success: false, message: "Please Login first" },
                { status: 401 }
            );
        }

        await ConnectDB();

        const currentUser = await userModel.findById(payload.userId).select("-password");

        if(!currentUser){
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 401 }
            );
        }

        const id = request.nextUrl.searchParams.get("id");

        if(!id || !mongoose.isValidObjectId(id)){
            return NextResponse.json(
                { success: false, message: "Invalid blog ID" },
                { status: 400 }
            );
        }

        const blog = await BlogModel.findById(id);

        if(!blog){
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        if(!blog.authorId || blog.authorId.toString() !== currentUser._id.toString()){
            return NextResponse.json(
                { success: false, message: "You cannot delete this blog" },
                { status: 403 }
            );
        }

        await BlogModel.findByIdAndDelete(id);

        if(blog.image){
            const imagePath = path.join(
                process.cwd(), "public", path.basename(blog.image)
            );

            try{
                await unlink(imagePath);
            } catch(error){
                if(error.code !== "ENOENT"){
                    console.error("Image deletion error: ", error);
                }
            }
        }

        return NextResponse.json(
            {success: true, message: "Blog Deleted"}
        );
    } catch(error){
        console.error("Delete blog error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete blog" },
            { status: 500 }
        );
    }
}


// edit blog
export async function PUT(request){
    try{
        const payload = await getCurrentUser();

        if(!payload?.userId){
            return NextResponse.json(
                {success: false, message: "Please log in first"},
                {status: 401}
            );
        }

        await ConnectDB();

        const currentUser = await userModel.findById(payload.userId).select("-password");

        if(!currentUser){
            return NextResponse.json(
                {success: false, message: "User not found"},
                {status: 400}
            );
        }

        const id = request.nextUrl.searchParams.get("id");

        if(!id || !mongoose.isValidObjectId(id)){
            return NextResponse.json(
                {success: false, message: "Invalid blog id"},
                {status: 400}
            );
        }

        const blog = await BlogModel.findById(id);

        if(!blog){
            return NextResponse.json(
                {success: false, message: "Blog not found"},
                {status: 404}
            );
        }

        if(!blog.authorId || blog.authorId.toString() !== currentUser._id.toString()){
            return NextResponse.json(
                {success: false, message: "You cannot edit this blog"},
                {status: 403}
            );
        }

        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const image = formData.get("image");

        if( typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof category !== "string" ||
            !category.trim()
        ){
            return NextResponse.json(
                {success: false, message: "Invalid blog information"},
                {status: 400}
            );
        }

        const updateData = {
            title: title.trim(),
            description: description,
            category: category.trim()
        }

        if(image instanceof File && image.size > 0){
            const imageName = `${Date.now()}_${image.name}`
            const imagePath = path.join(
                process.cwd(),
                "public",
                imageName
            );

            const buffer = Buffer.from(await image.arrayBuffer());

            await writeFile(imagePath, buffer);
            
            updateData.image = `/${imageName}`;
        }

        await BlogModel.findByIdAndUpdate(id, updateData, { runValidators: true});

        return NextResponse.json(
            {success: true, message: "Blog updated"}
        );

    } catch(error){
        console.error("Update blog error: ", error);
        
        return NextResponse.json(
            {success: false, message: "Failed to update blog"},
            {status: 500}
        );
    }
}