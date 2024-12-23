
import mongoose from "mongoose";
import 'dotenv/config'
const connectToMongodb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("---***Database Connected Successfully***---");
    } catch (error) {
        console.log(error)
        
    }
}
export default connectToMongodb;