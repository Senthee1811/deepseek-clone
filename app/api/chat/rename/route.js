import Chat from "@/models/Chat"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; 
import connectDB from "@/config/db"; 

export async function POST (req){
    try {
        const {userId} = getAuth(req); 

        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }
        await connectDB(); 
        const {chatId,name} = await req.json(); 
        await Chat.findOneAndUpdate({_id:chatId,userId},{name}); 
        return NextResponse.json({success:true,message:"Chat renamed successfully"},{status:200});
    } catch (error) {
        return NextResponse.json({success:false,message:"Something went wrong",error: error.message},{status:500})
        
    }
}