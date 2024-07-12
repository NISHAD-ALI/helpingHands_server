import user from "../entities/user";
import post from "../entities/post";
import Cloudinary from "../frameworks/utils/cloudinary";
import IPostInterface from "./interfaces/IPostInterface";
import Jwt from "../frameworks/utils/jwtAuth";
import jwt, { JwtPayload } from 'jsonwebtoken'

class postUsecase {
    private postRepo: IPostInterface;
    private cloudinary: Cloudinary;
    private jwt: Jwt;
    constructor(postRepo: IPostInterface,cloudinary: Cloudinary, jwt: Jwt) {
        this.postRepo = postRepo
        this.cloudinary = cloudinary
        this.jwt = jwt
    }
    async createEvent(postData : post){
        try {
            let image = postData.image
            let uploadImages = await this.cloudinary.uploadImageToCloud(image)
            postData.image = uploadImages
            let response = await this.postRepo.createPost(postData)
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getPostsOne(id:string){
        try {
            let data = await this.postRepo.getPostsOne(id)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getAllPosts(){
        try {
            let data = await this.postRepo.getPosts()
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async editPost(id: string, postData: Partial<post>) {
        try {
            let uploadFile = await this.cloudinary.uploadImageToCloud(postData.image)
            postData.image = uploadFile
            let response = await this.postRepo.editPost(id,postData);
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async deletePost(id:string,userId:string){
        try {
            let data = await this.postRepo.deletePost(id,userId)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async likePost(id:string,userId:string){
        try {
            let data = await this.postRepo.likePost(id,userId)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async isLiked(id:string,userId:string){
        try {
            let data = await this.postRepo.isLiked(id,userId)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async addComment(postId:string,userId:string,message:string,createdAt:Date){
        try {
             const comment = {
                userId,
                message,
                createdAt
             }
                const commented = await this.postRepo.addComment(postId,comment)
                if(commented){
                    return true
                }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getComments(postId:string){
        try {
            let data = await this.postRepo.getComments(postId)
            return data?.comments
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async reportPost(postId:string,userId:string,message:string){
        try {
             const response = await this.postRepo.reportPost(postId,userId,message)
             return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async savePost(postData : post,userId:string){
        try {
            let response = await this.postRepo.savedPost(postData,userId)
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.log("EEE",error);
            throw error;
        }
    }
    async getSavedPosts(id:string){
        try {
            let data = await this.postRepo.getSavedPosts(id)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default postUsecase