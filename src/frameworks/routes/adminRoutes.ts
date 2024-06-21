import express from "express";
import adminRepository from "../repositories/adminRepository";
import adminUsecase from "../../useCases/adminUsecase";
import adminController from "../../controllers/adminController";
import Jwt from "../utils/jwtAuth";
import HashPassword from "../utils/hashedPassword";
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middlewares/multer";

const router = express.Router()
const adminRepo = new adminRepository()
const jwt = new Jwt()
const hash = new HashPassword()
const cloudinary = new Cloudinary()

const admin = new adminUsecase(adminRepo,jwt,hash,cloudinary)
const Controller = new adminController(admin,jwt)

router.post('/login',(req,res)=>Controller.login(req,res))
router.get('/logout',(req,res)=>Controller.logout(req,res))
router.get('/getCommunities',(req,res)=>Controller.getAllCommunities(req,res))
router.get('/getUsers',(req,res)=>Controller.getUsers(req,res))
router.post('/blockUser/:id',(req,res)=>Controller.blockUser(req,res))
router.post('/createDonation',uploadFile.single('image'),(req,res)=>Controller.createDonation(req,res))
router.get('/getDonations',(req,res)=>Controller.getDonations(req,res))
export default router
