import { Request, Response } from "express";
import eventUsecase from "../useCases/eventUsecase";
import eventModel from "../frameworks/database/eventModel";
import events from "../entities/events";
import Jwt from "../frameworks/utils/jwtAuth";
import jwt, { JwtPayload } from 'jsonwebtoken'

class eventController {
    private eventUsecase: eventUsecase;
    private jwt: Jwt;
    constructor(eventUsecase: eventUsecase,jwt: Jwt) {
        this.eventUsecase = eventUsecase
        this.jwt = jwt
    }
    async createEvents(req: Request, res: Response) {
        try {
            const { name, volunteerCount, details, shifts } = req.body;
            const parsedShifts = JSON.parse(shifts);
            let filesInfo: Array<{ filename: string, mimetype: string, path: string }> = [];
            if (Array.isArray(req.files)) {
                req.files.forEach((file: Express.Multer.File) => {
                    const fileInfo = {
                        filename: file.originalname,
                        mimetype: file.mimetype,
                        path: file.path
                    };
                    filesInfo.push(fileInfo);
                });
            }
            let images: Array<any> = [];
            let video: any = null;
    
            filesInfo.forEach((fileInfo) => {
                if (fileInfo.mimetype.startsWith('image/')) {
                    images.push(fileInfo);
                } else if (fileInfo.mimetype.startsWith('video/')) {
                    video = fileInfo;
                }
            });
    
            console.log('Images:', images);
            console.log('Video:', video);
            const token = req.cookies.communityToken;
            let communityId;
            try {
                const payload = this.jwt.verifyToken(token);
                if (payload) {
                    communityId = payload.id;
                    console.log(communityId);
                } else {
                    throw new Error('Invalid token or missing payload');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            const eventData: events = {
                name,
                details,
                shifts: parsedShifts,
                images,
                video: video || '',
                volunteerCount,
                communId: communityId,
            };
            const newData = await this.eventUsecase.createEvent(eventData as events);
            if (newData) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Cannot Create Event!' })
            }
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getEvents(req: Request, res: Response){
        try {
            const token = req.cookies.communityToken;
            let communityId;
            try {
                const payload = this.jwt.verifyToken(token);
                if (payload) {
                    communityId = payload.id;
                    console.log(communityId);
                } else {
                    throw new Error('Invalid token or missing payload');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            let events = await this.eventUsecase.getAllEvents(communityId)
            if (events) {
                res.status(200).json({ success: true, events })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getEventsById(req: Request, res: Response){
        try {
            const eventId = req.params.id;
            let event = await this.eventUsecase.getEventsById(eventId)
            if(!event){
                 res.status(401).json({ success: false, message: 'No event' });
            }else{
                 res.status(200).json({ success: true, event })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async deleteEvent(req: Request, res: Response){
        try {
            const eventId = req.params.id;
            let event = await this.eventUsecase.deleteEvent(eventId)
            if(!event){
                 res.status(401).json({ success: false, message: 'No event to delete' });
            }else{
                 res.status(200).json({ success: true, event })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}    



export default eventController
