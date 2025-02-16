import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDb connected ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error connecting with mongoDb`, error)
    }
}

export default connectDb