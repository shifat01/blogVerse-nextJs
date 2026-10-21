import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises'
import BlogModel from "@/lib/models/BlogModel";
import { getCurrentUser } from "@/lib/auth";
import userModel from "@/lib/models/userModel";

const fs = require('fs');

// const LoadDB = async () => {
//     await ConnectDB();
// }

// LoadDB();


// API Endpoint to get all blogs
export async function GET(request){

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
    const authorImg = formData.get("authorImage");

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
    const path = `/public/${imageName}`;

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    await writeFile(path, buffer);

    const imgUrl = `/${imageName}`;

    const blogData = {
        title: title.trim(),
        description,
        category: category.trim(),
        author: currentUser.name,
        image: imgUrl,
        authorImage: typeof authorImg === "string"? authorImg: ""
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
    const id = await request.nextUrl.searchParams.get('id');
    const blog = await BlogModel.findById(id);
    fs.unlink(`./public${blog.image}`, ()=>{}); // deleting from public folder
    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({msg:"Blog Deleted"})
}