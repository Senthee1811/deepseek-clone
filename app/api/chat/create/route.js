import connectDB from "@/config/db"; 
import Chat from "@/models/Chat"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; 

export async function POST(req){
    try {
        const {userId} = getAuth(req); 

        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }
        await connectDB(); 
        const chatData = {
            userId,
            messages:[],
            name:"New Chat"
        }; 

        await connectDB(); 
        await Chat.create(chatData); 
        return NextResponse.json({success:true,message:"Chat created successfully"},{status:200});
        } 

        catch (error) {
        return NextResponse.json({success:false,message:"Something went wrong",error: error.message},{status:500})
        
    }
    } 
