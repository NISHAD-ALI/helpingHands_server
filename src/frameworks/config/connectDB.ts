import mongoose from 'mongoose'

export const connectDB = () => {
     try {
          const mongoURL = process.env.MONGODB_URL as string
          mongoose.connect(mongoURL)
          console.log("Database connected");

     } catch (error) {
          console.error('An error occurred while connecting the mongoDB:', error);
     }
}
export default connectDB