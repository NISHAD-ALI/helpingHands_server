import User from "../../entities/user";
import userModel from "../database/userModel";
import IUserInterface from "../../useCases/interfaces/IUserInterface";


class userRepository implements IUserInterface {
    async findUserByEmail(email: string): Promise<User | null> {
        try {
            let userData = await userModel.findOne({ email: email })
            return userData ? userData.toObject() : null

        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch user data')
        }
    }
     async saveUser(user: User): Promise<User | null> {
        try {
            let newUser = new userModel(user);
            await newUser.save();
            return newUser ? newUser.toObject() : null;
        } catch (error: any) {
            console.error(error.message);
            throw new Error('unable to save user data');
        }
    }
    async findUserById(id: string): Promise<User | null> {
        try {
            let userdata: User | null = await userModel.findById(id)
            return userdata
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find user")
        }
    }
    async changePassword(email: string, password: string): Promise<boolean> {
        try {
            let user = await userModel.updateOne({email:email},{$set:{password:password}})
            return user.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update password")
        }
    }
}

export default userRepository