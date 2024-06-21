import user from "../../entities/user";

interface IUserInterface {
    findUserByEmail(email: string): Promise<user | null>
    saveUser(user: user): Promise<user | null>,
    findUserById(id: string): Promise<user | null>,
    changePassword(email:string,password:string):Promise<boolean>,
    editUser(id: string, user: user): Promise<boolean>,
    donation(amount:number,userId:string,donationId:string): Promise<boolean>
}

export default IUserInterface