import Chat from "@/models/Chat"; 
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"; 
import connectDB from "@/config/db";


export async function GET(req){
    try {
        const {userId} = getAuth(req); 

        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        }
        await connectDB(); 
        const data = await Chat.find({userId}); 
        return NextResponse.json({success:true,data},{status:200});
    } catch (error) {
        return NextResponse.json({success:false,message:"Something went wrong",error: error.message},{status:500})
        
    }
}