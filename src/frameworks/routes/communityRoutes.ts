import express from "express";
import communityController from "../../controllers/communityController";
import communityUsecase from "../../useCases/communityUsecase";
import Jwt from "../utils/jwtAuth";
import SendMail from "../utils/mailGenerator";
import OtpGenerator from "../utils/otpGenerator";
import HashPassword from "../utils/hashedPassword";
import communityRepository from "../repositories/communityRepository";
import { uploadFile } from "../middlewares/multer";
import Cloudinary from "../utils/cloudinary";
import eventUsecase from "../../useCases/eventUsecase";
import eventRepository from "../repositories/eventRepository";
import eventController from "../../controllers/eventController";
import communityAuth from "../middlewares/communityAuth";
import chatController from "../../controllers/chatController";
import chatUsecase from "../../useCases/chatUsecase";
import chatRepository from "../repositories/chatRepository";

const router = express.Router()
const communityRepo = new communityRepository()
const otp = new OtpGenerator()
const jwt = new Jwt()
const mail = new SendMail()
const hash = new HashPassword()
const cloudinary = new Cloudinary()
const eventRepo = new eventRepository()
const chatRepo = new chatRepository()

const community = new communityUsecase(communityRepo,otp,jwt,mail,hash,cloudinary)
const commController = new communityController(community)
const event = new eventUsecase(eventRepo,cloudinary,jwt)
const eventNewController = new eventController(event,jwt)
const chat = new chatUsecase(chatRepo)
const chatNewController = new chatController(chat)

router.post('/signup',(req,res)=>commController.signup(req,res))
router.post('/verifyOtp',(req,res)=>commController.verifyOtp(req,res))
router.post('/login',(req,res)=>commController.login(req,res))
router.get('/logout',(req,res)=>commController.logout(req,res))
router.post('/resendOtp',(req,res)=>commController.resendOtp(req,res))

router.post('/createEvents',communityAuth,uploadFile.any(),(req,res)=>eventNewController.createEvents(req,res))
router.get('/getEvents',(req,res)=>eventNewController.getEvents(req,res))
router.get('/getEventsById/:id',(req,res)=>eventNewController.getEventsById(req,res))
router.get('/deleteEvent/:id',(req,res)=>eventNewController.deleteEvent(req,res))
router.patch('/editEvent',uploadFile.any(),(req,res)=>eventNewController.editEvent(req,res))

router.get('/profile',communityAuth,(req,res)=>commController.getProfile(req,res))
router.patch('/editProfile',communityAuth,uploadFile.single('profileImage'),(req,res)=>commController.editProfile(req,res))
router.patch('/updateStatus',communityAuth,(req,res)=>commController.updateStatus(req,res))
router.get('/getVolunteers',communityAuth,(req,res)=>commController.getVolunteers(req,res))

router.get('/getEventsFilteredByDateRange',(req,res)=>eventNewController.getEventsFilteredByDateRange(req,res))
router.get('/getEventsFilteredByCategory',(req,res)=>eventNewController.getEventsFilteredByCategory(req,res))
router.get('/getEventsFilteredByDay',(req,res)=>eventNewController.getEventsFilteredByDay(req,res))
router.get('/searchEvents',(req,res)=>eventNewController.searchEvents(req,res))

router.get("/messages/:id", (req,res)=>chatNewController.getMessages(req,res));
router.post("/saveMessages", (req,res)=>chatNewController.sendMessage(req,res));
export default router