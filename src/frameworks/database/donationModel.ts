import mongoose,{Document,Schema} from 'mongoose'
import donations from '../../entities/donations';

const donationSchema : Schema<donations> = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String
    },
    details:{
        type:String
    },
    image:{
        type:String
    },
    targetAmount:{
        type:Number
    },
    name:{
        type:String,
        required:true
    },
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    type:{
        type:String
    },
    amountCollected:{
        type:Number,
        default:0
    },
    donatedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    is_active:{
        type:Boolean,
        default:true
    }
})

const donationModel = mongoose.model<donations>('donations',donationSchema);
export default donationModel;