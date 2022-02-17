import mongoose from 'mongoose';


export const connectDB = async (url: string): Promise<void> => {
    mongoose.connect(url);
    console.log('CONNECTED TO DB');
};




