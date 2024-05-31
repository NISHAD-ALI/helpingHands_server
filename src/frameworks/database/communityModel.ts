import mongoose,{ Schema,model } from "mongoose";
import community from "../../entities/community";


const communitySchmea :Schema<community> = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    phone:{
        type:Number
    },
    volunteers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'volunteer',
            default: []
        }
    ],
    profileImage:{
        type:String,
    },
    about:{
        type:String,
    },
    is_blocked: {
        type: Boolean,
        default: false
    }

})
const communityModel = model<community>('community', communitySchmea);

export default communityModel;