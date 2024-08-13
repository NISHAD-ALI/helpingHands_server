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
class adminController {
    constructor(adminUsecase, jwt) {
        this.adminUsecase = adminUsecase;
        this.jwt = jwt;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let checkAdmin = yield this.adminUsecase.login(email, password);
                if (checkAdmin.success) {
                    res.cookie('adminToken', checkAdmin.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json({ success: true, token: checkAdmin.token });
                }
                else {
                    console.log(checkAdmin.message);
                    res.status(401).json({ success: false, message: checkAdmin.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getAllCommunities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let communities = yield this.adminUsecase.getAllCommunities();
                if (communities) {
                    res.status(200).json({ success: true, communities });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield this.adminUsecase.getUsers();
                if (userData) {
                    res.status(200).json({ success: true, userData });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.params.id;
                let blocked = yield this.adminUsecase.blockUser(userId);
                if (blocked) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.params.id;
                let blocked = yield this.adminUsecase.blockCommunity(userId);
                if (blocked) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    createDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fundraiserName, email, targetAmount, donationType, startDate, endDate, contactAddress, details } = req.body;
                let image = req.file;
                const donationData = {
                    name: fundraiserName, email, image, targetAmount, type: donationType, startDate, endDate, contact: contactAddress, details
                };
                const response = yield this.adminUsecase.createDonation(donationData);
                if (response) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(401).json({ message: 'Please Try Again later' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getDonations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let donations = yield this.adminUsecase.getDonations();
                if (donations) {
                    res.status(200).json({ success: true, donations });
                }
                else {
                    res.status(500).json({ success: false, message: "Please try again" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getAllReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let reports = yield this.adminUsecase.getAllReports();
                if (reports) {
                    res.status(200).json({ success: true, reports });
                }
                else {
                    res.status(500).json({ success: false, message: "Please try again" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    terminatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, userId, reasons } = req.body;
                let response = yield this.adminUsecase.terminatePost(postId, userId, reasons);
                if (response) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getAllvolunteers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteers = yield this.adminUsecase.getAllVolunteers();
                if (volunteers) {
                    res.status(200).json({ success: true, volunteers });
                }
                else {
                    res.status(500).json({ success: false, message: "Please try again" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let events = yield this.adminUsecase.getEvents();
                if (events) {
                    res.status(200).json({ success: true, events });
                }
                else {
                    res.status(500).json({ success: false, message: "Please try again" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    deleteDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let deleted = yield this.adminUsecase.deleteDonation(id);
                if (deleted) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.default = adminController;
