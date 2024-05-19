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

const router = express.Router()
const userRepo = new userRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()
const cloudinary = new Cloudinary()

const useCase = new userUseCases(userRepo,otp,jwt,mail,hash,cloudinary)
const userController = new UserController(useCase)

router.post('/signup',(req,res)=>userController.signup(req,res))
router.post('/verifyOtp',(req,res)=>userController.verifyOtp(req,res))
router.post('/login',(req,res)=>userController.login(req,res))
router.get('/logout',(req,res)=>userController.logout(req,res))
router.post('/resendOtp',(req,res)=>userController.resendOtp(req,res))
// router.post('/googleSignup',(req,res)=>userController.googleAuth(req,res))
router.post('/forgotPassword',(req,res)=>userController.forgetPassword(req,res))
router.post('/forgotPassOtpVerify',(req,res)=>userController.forgotPasswordOtpVerification(req,res))
router.post('/changePassword',(req,res)=>userController.changePassword(req,res))
router.get('/profile',userAuth,(req,res)=>userController.getProfile(req,res))
router.patch('/editProfile',userAuth,uploadFile.single('profileImage'),(req,res)=>userController.editProfile(req,res))

export default router