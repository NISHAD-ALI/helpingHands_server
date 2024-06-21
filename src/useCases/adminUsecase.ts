import admin from "../entities/admin";
import IAdminInterface from "./interfaces/IAdminInterface";
import jwt, { JwtPayload } from 'jsonwebtoken'
import Jwt from "../frameworks/utils/jwtAuth";
import HashPassword from "../frameworks/utils/hashedPassword";
import donations from "../entities/donations";
import Cloudinary from "../frameworks/utils/cloudinary";

class adminUsecase {
    private adminRepo: IAdminInterface;
    private jwt: Jwt;
    private hashPassword: HashPassword
    private cloudinary: Cloudinary;
    constructor(adminRepo: IAdminInterface, jwt: Jwt,hashPassword: HashPassword,cloudinary: Cloudinary,) {
        this.adminRepo = adminRepo
        this.jwt = jwt
        this.hashPassword = hashPassword
        this.cloudinary = cloudinary
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
    async getUsers(){
        try {
            let data = await this.adminRepo.getUsers()
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async blockUser(id: string) {
        try {
            let blocked = await this.adminRepo.blockUser(id);
            return blocked;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async createDonation(donation : donations){
        try {
            let images = donation.image
            console.log(images)
            let uploadImages = await this.cloudinary.uploadImageToCloud(images)
            donation.image = uploadImages
            console.log("hi");
            
            let response = await this.adminRepo.createDonation(donation)
            console.log(response + "-> useCase response")
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getDonations(){
        try {
            let data = await this.adminRepo.getDonations()
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default adminUsecase