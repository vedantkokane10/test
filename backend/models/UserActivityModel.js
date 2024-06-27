import mongoose from "mongoose";


const activitySchema = new mongoose.Schema({
    songName : {
        type: String,
        required: true
    },
    artistName : {
        type: String,
        required: true
    },
    songGenre :{
        type: String,
        required: true
    }
}, {timestamps:true});

export default mongoose.model("Activity", activitySchema);
