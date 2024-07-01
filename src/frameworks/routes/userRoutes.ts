import express from "express";
import UserController from "../../controllers/userController";
import userUseCases from "../../useCases/userUsecase";
import Jwt from "../utils/jwtAuth";
import SendMail from "../utils/mailGenerator";
import OtpGenerator from "../utils/otpGenerator";
import HashPassword from "../utils/hashedPassword";
import userAuth from "../middlewares/userAuth";
import userRepository from "../repositories/userRepository";
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middlewares/multer";
import stripePayment from "../utils/stripe";
import postController from "../../controllers/postController";
import postRepository from "../repositories/postRepository";
import postUsecase from "../../useCases/postUsecase";

const router = express.Router()
const userRepo = new userRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()
const cloudinary = new Cloudinary()
const stripe = new stripePayment()
const useCase = new userUseCases(userRepo,otp,jwt,mail,hash,cloudinary,stripe)
const userController = new UserController(useCase)
const postRepo = new postRepository()
const postUseCase = new postUsecase(postRepo,cloudinary,jwt)
const postControl = new postController(postUseCase,jwt)

router.post('/signup',(req,res)=>userController.signup(req,res))
router.post('/verifyOtp',(req,res)=>userController.verifyOtp(req,res))
router.post('/login',(req,res)=>userController.login(req,res))
router.get('/logout',(req,res)=>userController.logout(req,res))
router.post('/resendOtp',(req,res)=>userController.resendOtp(req,res))
router.post('/googleAuth',(req,res)=>userController.googleAuth(req,res))
router.post('/forgotPassword',(req,res)=>userController.forgetPassword(req,res))
router.post('/forgotPassOtpVerify',(req,res)=>userController.forgotPasswordOtpVerification(req,res))
router.post('/changePassword',(req,res)=>userController.changePassword(req,res))
router.get('/profile',userAuth,(req,res)=>userController.getProfile(req,res))
router.patch('/editProfile',userAuth,uploadFile.single('profileImage'),(req,res)=>userController.editProfile(req,res))
router.post('/payment',userAuth,(req,res)=>userController.fundraiser(req,res))

router.post('/createPost',uploadFile.single('image'),(req,res)=>postControl.createEvents(req,res))
router.get('/getPostsOne',userAuth,(req,res)=>postControl.getPostsOne(req,res))
router.get('/getAllPosts',(req,res)=>postControl.getAllPosts(req,res))
router.patch('/editPost',userAuth,uploadFile.single('image'),(req,res)=>postControl.editPost(req,res))
router.get('/deletePost/:id',userAuth,(req,res)=>postControl.deletePost(req,res))
router.post('/likePost/:id',userAuth,(req,res)=>postControl.likePost(req,res))
router.get('/isLiked/:id',userAuth,(req,res)=>postControl.isLiked(req,res))
router.post('/addComment/:id',userAuth,(req,res)=>postControl.addComment(req,res))
router.get('/getComments/:id',(req,res)=>postControl.getComments(req,res))
router.post('/reportPost',userAuth,(req,res)=>postControl.reportPost(req,res))

export default router