import user from "../../entities/user";

interface IUserInterface {
    findUserByEmail(email: string): Promise<user | null>
    saveUser(user: user): Promise<user | null>
    
}

export default IUserInterface