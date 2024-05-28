import mongoose,{Document,Schema} from 'mongoose'
import Admin from '../../entities/admin';

const adminSchema : Schema<Admin> = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const adminModel = mongoose.model<Admin>('admin',adminSchema);
export default adminModel;