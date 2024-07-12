import express from "express";
import adminRepository from "../repositories/adminRepository";
import adminUsecase from "../../useCases/adminUsecase";
import adminController from "../../controllers/adminController";
import Jwt from "../utils/jwtAuth";
import HashPassword from "../utils/hashedPassword";
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middlewares/multer";
import postRepository from "../repositories/postRepository";
import SendMail from "../utils/mailGenerator";
import userRepository from "../repositories/userRepository";

const router = express.Router()
const adminRepo = new adminRepository()
const jwt = new Jwt()
const hash = new HashPassword()
const cloudinary = new Cloudinary()
const postRepo = new postRepository
const mail = new SendMail()
const userRepo = new userRepository()
const admin = new adminUsecase(adminRepo,jwt,hash,cloudinary,postRepo,mail,userRepo)
const Controller = new adminController(admin,jwt)

router.post('/login',(req,res)=>Controller.login(req,res))
router.get('/logout',(req,res)=>Controller.logout(req,res))
router.get('/getCommunities',(req,res)=>Controller.getAllCommunities(req,res))
router.get('/getUsers',(req,res)=>Controller.getUsers(req,res))
router.post('/blockUser/:id',(req,res)=>Controller.blockUser(req,res))
router.post('/blockCommunity/:id',(req,res)=>Controller.blockCommunity(req,res))
router.post('/createDonation',uploadFile.single('image'),(req,res)=>Controller.createDonation(req,res))
router.get('/getDonations',(req,res)=>Controller.getDonations(req,res))
router.get('/getAllReports',(req,res)=>Controller.getAllReports(req,res))
router.post('/terminatePost',(req,res)=>Controller.terminatePost(req,res))
router.get('/getAllVolunteers',(req,res)=>Controller.getAllvolunteers(req,res))
router.get('/getAllEvents',(req,res)=>Controller.getEvents(req,res))
router.delete('/deleteDonation/:id',(req,res)=>Controller.deleteDonation(req,res))

export default router
