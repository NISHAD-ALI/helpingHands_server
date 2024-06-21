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
import volunteerAuth from "../middlewares/volunteerAuth";
import communityUsecase from "../../useCases/communityUsecase";
import communityRepository from "../repositories/communityRepository";
import communityController from "../../controllers/communityController";

const router = express.Router()
const volunteerRepo = new volunteerRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()
const cloudinary = new Cloudinary()
const communityRepo = new communityRepository()

const useCase = new volunteerUseCases(volunteerRepo,otp,jwt,mail,hash,cloudinary)
const volunteerController = new VolunteerController(useCase)
const community = new communityUsecase(communityRepo,otp,jwt,mail,hash,cloudinary)
const commController = new communityController(community)

router.post('/signup',(req,res)=>volunteerController.signup(req,res))
router.post('/verifyOtp',(req,res)=>volunteerController.verifyOtp(req,res))
router.post('/login',(req,res)=>volunteerController.login(req,res))
router.get('/logout',(req,res)=>volunteerController.logout(req,res))
router.post('/resendOtp',(req,res)=>volunteerController.resendOtp(req,res))
router.post('/changePassword',(req,res)=>volunteerController.changePassword(req,res))
router.get('/profile',volunteerAuth,(req,res)=>volunteerController.getProfile(req,res))
router.patch('/editProfile',volunteerAuth,uploadFile.single('profileImage'),(req,res)=>volunteerController.editProfile(req,res))
router.get('/community/:id',(req,res)=>commController.getCommunityById(req,res))
router.post('/enroll',(req,res)=>volunteerController.enrollToCommunity(req,res))
router.get('/getVolunteer',(req,res)=>volunteerController.getVolunteerById(req,res))
router.get('/getEvents',volunteerAuth,(req,res)=>volunteerController.getEvents(req,res))
router.post('/enrollToEvent',volunteerAuth,(req,res)=>volunteerController.enrollToEvent(req,res))
router.get('/getNotEnrolledEvents',volunteerAuth,(req,res)=>volunteerController.getNotEnrolledEvents(req,res))
router.get('/getEnrolledEvents',volunteerAuth,(req,res)=>volunteerController.getEnrolledEvents(req,res))

export default router