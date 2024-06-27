import mongoose from 'mongoose';
const uri = "mongodb+srv://vedantkokanevk:admin@cluster0.mvftljg.mongodb.net/SpotifyData?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected successfully: ${connect}`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB");
        console.error(error);
        process.exit(1);
    }
}


export { connectDB };