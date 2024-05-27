import express from "express";
import VolunteerController from "../../controllers/volunteerController";
import volunteerUseCases from "../../useCases/volunteerUsecase";
import Jwt from "../utils/jwtAuth";
import SendMail from "../utils/mailGenerator";
import OtpGenerator from "../utils/otpGenerator";
import HashPassword from "../utils/hashedPassword";
import volunteerRepository from "../repositories/volunteerRepository";
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middlewares/multer";

const router = express.Router()
const volunteerRepo = new volunteerRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()
const cloudinary = new Cloudinary()

const useCase = new volunteerUseCases(volunteerRepo,otp,jwt,mail,hash,cloudinary)
const volunteerController = new VolunteerController(useCase)

router.post('/signup',(req,res)=>volunteerController.signup(req,res))
router.post('/verifyOtp',(req,res)=>volunteerController.verifyOtp(req,res))
router.post('/login',(req,res)=>volunteerController.login(req,res))
router.get('/logout',(req,res)=>volunteerController.logout(req,res))
router.post('/resendOtp',(req,res)=>volunteerController.resendOtp(req,res))
// router.post('/googleAuth',(req,res)=>volunteerController.googleAuth(req,res))
// router.post('/forgotPassword',(req,res)=>volunteerController.forgetPassword(req,res))
// router.post('/forgotPassOtpVerify',(req,res)=>volunteerController.forgotPasswordOtpVerification(req,res))
// router.post('/changePassword',(req,res)=>volunteerController.changePassword(req,res))
// router.get('/profile',userAuth,(req,res)=>volunteerController.getProfile(req,res))
// router.patch('/editProfile',userAuth,uploadFile.single('profileImage'),(req,res)=>volunteerController.editProfile(req,res))

export default router