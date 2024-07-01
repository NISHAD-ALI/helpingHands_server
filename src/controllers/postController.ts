import { Request, Response } from "express";
import postUsecase from "../useCases/postUsecase";
import postModel from "../frameworks/database/postModel";
import post from "../entities/post";
import Jwt from "../frameworks/utils/jwtAuth";
import jwt, { JwtPayload } from 'jsonwebtoken'

class postController {
    private postUsecase: postUsecase;
    private jwt: Jwt;
    constructor(postUsecase: postUsecase, jwt: Jwt) {
        this.postUsecase = postUsecase
        this.jwt = jwt
    }
    async createEvents(req: Request, res: Response) {
        try {
            const { title } = req.body
            const createDate: any = Date.now()
            let image: any = req.file
            const token = req.cookies.userToken;
            let userId;
            try {
                const payload = this.jwt.verifyToken(token);
                if (payload) {
                    userId = payload.id;
                } else {
                    throw new Error('Invalid token or missing payload');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            const postData: post = {
                image: image,
                title: title,
                userId: userId,
                postedDate: createDate
            }


            const data = await this.postUsecase.createEvent(postData)
            if (data) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Cannot Create post!' })
            }

        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getPostsOne(req: Request, res: Response) {
        try {
            const token = req.cookies.userToken;
            let userId;
            try {
                const payload = this.jwt.verifyToken(token);
                if (payload) {
                    userId = payload.id;
                } else {
                    throw new Error('Invalid token or missing payload');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            let posts = await this.postUsecase.getPostsOne(userId)
            if (posts) {
                res.status(200).json({ success: true, posts })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getAllPosts(req: Request, res: Response) {
        try {
            let posts = await this.postUsecase.getAllPosts()
            if (posts) {
                res.status(200).json({ success: true, posts })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async editPost(req: Request, res: Response) {
        try {
            const { id, title } = req.body
            let newImage: any = req.file
            const newData = {
                title: title,
                image: newImage
            }
            if (newData) {
                let updated = await this.postUsecase.editPost(id, newData);
                console.log("editing"+updated)
                if (updated) {
                    res.status(200).json({ success: true });

                } else {
                    res.status(500).json({ success: false, message: 'Cannot update user profile!' })
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async deletePost(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const postId = req.params.id;

            let post = await this.postUsecase.deletePost(postId, userId as string)
            if (!post) {
                res.status(401).json({ success: false, message: 'No post to delete' });
            } else {
                res.status(200).json({ success: true, post })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async likePost(req: Request, res: Response) {
        try {

            const userId = req.userId;
            const postId = req.params.id;

            let post = await this.postUsecase.likePost(postId, userId as string)
            if (!post) {
                res.status(401).json({ success: false, message: 'No post to delete' });
            } else {
                res.status(200).json({ success: true, post })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async isLiked(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const postId = req.params.id;
            let post = await this.postUsecase.isLiked(postId, userId as string)
            res.status(200).json({ post });
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async addComment(req: Request, res: Response) {
        try {
           const {message} = req.body          
             const userId = req.userId
           const date = new Date()
           const postId = req.params.id
           const response = await this.postUsecase.addComment(postId,userId as string,message,date)
           if(response){
            res.status(200).json({success:true})
           }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getComments(req: Request, res: Response) {
        try {
            const postId = req.params.id
            let data = await this.postUsecase.getComments(postId)
            if (data) {
                res.status(200).json({ success: true, data })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async reportPost(req: Request, res: Response) {
        try {
            const {postId,message} = req.body
            let userId = req.userId
           const response = await this.postUsecase.reportPost(postId,userId as string,message)
           if(response){
            res.status(200).json({success:true})
           }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}



export default postController
