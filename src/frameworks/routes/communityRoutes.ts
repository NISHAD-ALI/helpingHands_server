import express from "express";
import communityController from "../../controllers/communityController";
import communityUsecase from "../../useCases/communityUsecase";
import Jwt from "../utils/jwtAuth";
import SendMail from "../utils/mailGenerator";
import OtpGenerator from "../utils/otpGenerator";
import HashPassword from "../utils/hashedPassword";
import communityRepository from "../repositories/communityRepository";

const router = express.Router()
const communityRepo = new communityRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()

const community = new communityUsecase(communityRepo,otp,jwt,mail,hash)
const commController = new communityController(community)

router.post('/signup',(req,res)=>commController.signup(req,res))
router.post('/verifyOtp',(req,res)=>commController.verifyOtp(req,res))
router.post('/login',(req,res)=>commController.login(req,res))
router.get('/logout',(req,res)=>commController.logout(req,res))
router.post('/resendOtp',(req,res)=>commController.resendOtp(req,res))

export default router