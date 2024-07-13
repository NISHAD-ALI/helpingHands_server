"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class adminUsecase {
    constructor(adminRepo, jwt, hashPassword, cloudinary, postRepo, sendMail, userRepo) {
        this.adminRepo = adminRepo;
        this.jwt = jwt;
        this.hashPassword = hashPassword;
        this.cloudinary = cloudinary;
        this.postRepo = postRepo;
        this.sendMail = sendMail;
        this.userRepo = userRepo;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findAdmin = yield this.adminRepo.findAdminByEmail(email);
                console.log(findAdmin, email + "1111111");
                if (findAdmin) {
                    let passwordCheck = yield this.hashPassword.comparePassword(password, findAdmin.password);
                    if (passwordCheck) {
                        let token = this.jwt.generateToken(findAdmin._id, 'admin');
                        return { success: true, adminData: findAdmin, token };
                    }
                    else {
                        return { success: false, message: "Incorrect password" };
                    }
                }
                else {
                    return { success: false, message: "Email not found" };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllCommunities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getCommunities();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getUsers();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.adminRepo.blockUser(id);
                return blocked;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    blockCommunity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.adminRepo.blockCommunity(id);
                return blocked;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    createDonation(donation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let images = donation.image;
                console.log(images);
                let uploadImages = yield this.cloudinary.uploadImageToCloud(images);
                donation.image = uploadImages;
                console.log("hi");
                let response = yield this.adminRepo.createDonation(donation);
                console.log(response + "-> useCase response");
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getDonations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getDonations();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getAllReports();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    terminatePost(postId, userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userRepo.findUserById(userId);
                console.log(user + "eda mwone");
                yield this.sendMail.reportPostMail(user === null || user === void 0 ? void 0 : user.email, postId);
                let data = yield this.postRepo.deletePost(postId, userId);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllVolunteers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getAllVolunteeers();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.adminRepo.getEvents();
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteDonation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let donation = yield this.adminRepo.deleteDonation(id);
                return donation;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.default = adminUsecase;
