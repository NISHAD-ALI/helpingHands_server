import express from "express";
import adminRepository from "../repositories/adminRepository";
import adminUsecase from "../../useCases/adminUsecase";
import adminController from "../../controllers/adminController";
import Jwt from "../utils/jwtAuth";
import HashPassword from "../utils/hashedPassword";

const router = express.Router()
const adminRepo = new adminRepository()
const jwt = new Jwt()
const hash = new HashPassword()

const admin = new adminUsecase(adminRepo,jwt,hash)
const Controller = new adminController(admin,jwt)

router.post('/login',(req,res)=>Controller.login(req,res))
router.get('/logout',(req,res)=>Controller.logout(req,res))
router.get('/getCommunities',(req,res)=>Controller.getAllCommunities(req,res))

export default router