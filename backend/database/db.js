import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://digambermehta2603:digamber@cluster0.h6aev2r.mongodb.net/book_summary?retryWrites=true&w=majority");
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    };
 
export default connectDB;
