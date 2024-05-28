import admin from "../entities/admin";
import IAdminInterface from "./interfaces/IAdminInterface";
import jwt, { JwtPayload } from 'jsonwebtoken'
import Jwt from "../frameworks/utils/jwtAuth";
import HashPassword from "../frameworks/utils/hashedPassword";

class adminUsecase {
    private adminRepo: IAdminInterface;
    private jwt: Jwt;
    private hashPassword: HashPassword
    constructor(adminRepo: IAdminInterface, jwt: Jwt,hashPassword: HashPassword) {
        this.adminRepo = adminRepo
        this.jwt = jwt
        this.hashPassword = hashPassword
    }

    async login(email: string, password: string) {
        try {
            let findAdmin: any = await this.adminRepo.findAdminByEmail(email);
            console.log(findAdmin,email+"1111111");
            
            if (findAdmin) {
                let passwordCheck = await this.hashPassword.comparePassword(password, findAdmin.password);
                if (passwordCheck) {
                    let token = this.jwt.generateToken(findAdmin._id, 'admin')
                    return { success: true, adminData: findAdmin, token }
                } else {
                    return { success: false, message: "Incorrect password" }
                }
            } else {
                return { success: false, message: "Email not found" }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getAllCommunities(){
        try {
            let data = await this.adminRepo.getCommunities()
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default adminUsecase