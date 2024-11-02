import mongoose from "mongoose";
export const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.DB);
        console.log("DB Connection Successfull");
    }
    catch(error){
        console.log(error);
    }
}