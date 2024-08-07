import { Request, Response } from "express";
import adminUsecase from "../useCases/adminUsecase";
import Jwt from "../frameworks/utils/jwtAuth";
import donations from "../entities/donations";


class adminController {
    private adminUsecase: adminUsecase
    private jwt: Jwt
    constructor(adminUsecase: adminUsecase, jwt: Jwt) {
        this.adminUsecase = adminUsecase
        this.jwt = jwt
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            let checkAdmin = await this.adminUsecase.login(email, password)
            if (checkAdmin.success) {
                res.cookie('adminToken', checkAdmin.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                })
                res.status(200).json({ success: true, token: checkAdmin.token })
            } else {
                console.log(checkAdmin.message)
                res.status(401).json({ success: false, message: checkAdmin.message })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('adminToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getAllCommunities(req: Request, res: Response) {
        try {
            let communities = await this.adminUsecase.getAllCommunities()
            if (communities) {
                res.status(200).json({ success: true, communities })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            let userData = await this.adminUsecase.getUsers()
            if (userData) {
                res.status(200).json({ success: true, userData })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockUser(req: Request, res: Response) {
        try {
            let userId = req.params.id;
            let blocked = await this.adminUsecase.blockUser(userId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async blockCommunity(req: Request, res: Response) {
        try {
            let userId = req.params.id;
            let blocked = await this.adminUsecase.blockCommunity(userId);
            if (blocked) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async createDonation(req: Request, res: Response) {
        try {
            const { fundraiserName, email, targetAmount, donationType, startDate, endDate, contactAddress, details } = req.body
            let image: any = req.file
            const donationData: donations = {
                name: fundraiserName, email, image, targetAmount, type: donationType, startDate, endDate, contact: contactAddress, details
            }
            const response = await this.adminUsecase.createDonation(donationData)
            if (response) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ message: 'Please Try Again later' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getDonations(req: Request, res: Response) {
        try {
            let donations = await this.adminUsecase.getDonations()
            if (donations) {
                res.status(200).json({ success: true, donations })
            } else {
                res.status(500).json({ success: false, message: "Please try again" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getAllReports(req: Request, res: Response) {
        try {
            let reports = await this.adminUsecase.getAllReports()
            if (reports) {
                res.status(200).json({ success: true, reports })
            } else {
                res.status(500).json({ success: false, message: "Please try again" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async terminatePost(req: Request, res: Response) {
        try {
            const {
                postId,
                userId,
                reasons
            } = req.body
            let response = await this.adminUsecase.terminatePost(postId, userId, reasons);
            if (response) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getAllvolunteers(req: Request, res: Response) {
        try {
            let volunteers = await this.adminUsecase.getAllVolunteers()
            if (volunteers) {
                res.status(200).json({ success: true, volunteers })
            } else {
                res.status(500).json({ success: false, message: "Please try again" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getEvents(req: Request, res: Response) {
        try {
            let events = await this.adminUsecase.getEvents()
            if (events) {
                res.status(200).json({ success: true, events })
            } else {
                res.status(500).json({ success: false, message: "Please try again" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async deleteDonation(req: Request, res: Response) {
        try {
            let id = req.params.id;
            let deleted = await this.adminUsecase.deleteDonation(id);
            if (deleted) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default adminController