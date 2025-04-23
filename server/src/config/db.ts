import mongoose from 'mongoose'
export const connetToTheDB: (db:string)=>void  = async(db)=>{
        try {
            await mongoose.connect(db)
            console.log("data Base Conneted")
            return;
        } catch (error) {
            console.log(error)
            console.log("%c Could not Connet to the Data Base might me no url or Network issue ", "color:red;font-size:30px")
            return ;
        }
}