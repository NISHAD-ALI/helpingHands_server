"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repositories/adminRepository"));
const adminUsecase_1 = __importDefault(require("../../useCases/adminUsecase"));
const adminController_1 = __importDefault(require("../../controllers/adminController"));
const jwtAuth_1 = __importDefault(require("../utils/jwtAuth"));
const hashedPassword_1 = __importDefault(require("../utils/hashedPassword"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const multer_1 = require("../middlewares/multer");
const postRepository_1 = __importDefault(require("../repositories/postRepository"));
const mailGenerator_1 = __importDefault(require("../utils/mailGenerator"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const router = express_1.default.Router();
const adminRepo = new adminRepository_1.default();
const jwt = new jwtAuth_1.default();
const hash = new hashedPassword_1.default();
const cloudinary = new cloudinary_1.default();
const postRepo = new postRepository_1.default;
const mail = new mailGenerator_1.default();
const userRepo = new userRepository_1.default();
const admin = new adminUsecase_1.default(adminRepo, jwt, hash, cloudinary, postRepo, mail, userRepo);
const Controller = new adminController_1.default(admin, jwt);
router.post('/login', (req, res) => Controller.login(req, res));
router.get('/logout', (req, res) => Controller.logout(req, res));
router.get('/getCommunities', (req, res) => Controller.getAllCommunities(req, res));
router.get('/getUsers', (req, res) => Controller.getUsers(req, res));
router.post('/blockUser/:id', (req, res) => Controller.blockUser(req, res));
router.post('/blockCommunity/:id', (req, res) => Controller.blockCommunity(req, res));
router.post('/createDonation', multer_1.uploadFile.single('image'), (req, res) => Controller.createDonation(req, res));
router.get('/getDonations', (req, res) => Controller.getDonations(req, res));
router.get('/getAllReports', (req, res) => Controller.getAllReports(req, res));
router.post('/terminatePost', (req, res) => Controller.terminatePost(req, res));
router.get('/getAllVolunteers', (req, res) => Controller.getAllvolunteers(req, res));
router.get('/getAllEvents', (req, res) => Controller.getEvents(req, res));
router.delete('/deleteDonation/:id', (req, res) => Controller.deleteDonation(req, res));
exports.default = router;