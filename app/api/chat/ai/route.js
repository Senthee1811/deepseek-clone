export const maxDuration = 60;
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import Chat from "@/models/Chat";
import connectDB from "@/config/db";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req) {
    try {
        const {userId} = getAuth(req);

        const {chatId,prompt} = await req.json(); 

        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"},{status:401})
        } 

        const data = await Chat.findOne({userId,_id:chatId}) 
        const userPrompt = {
            role: "user", 
            content: prompt, 
            timestamp:Date.now(),
        } 
        await connectDB();
        data.messages.push(userPrompt); 

    const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "deepseek-chat",
    store: true,
  }); 

  const message = completion.choices[0].message; 
  message.timestamp = Date.now();  
  data.messages.push(message); 

  await data.save(); 

  return NextResponse.json({success:true,data:message},{status:200});


    } catch (error) {
        return NextResponse.json({success:false,message:"DeepSeek went wrong",error: error.message},{status:500})
        
    }
 
}

