import { Request, Response } from "express";
import eventUsecase from "../useCases/eventUsecase";
import eventModel from "../frameworks/database/eventModel";
import events from "../entities/events";
import Jwt from "../frameworks/utils/jwtAuth";

class eventController {
    private eventUsecase: eventUsecase;
    private jwt: Jwt;
    constructor(eventUsecase: eventUsecase, jwt: Jwt) {
        this.eventUsecase = eventUsecase
        this.jwt = jwt
    }
    async createEvents(req: Request, res: Response) {
        try {
            const { name, volunteerCount, details, shifts, category, is_online,city } = req.body;
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
                category: category,
                is_online: is_online,
                city : city
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
    async getEvents(req: Request, res: Response) {
        try {
            const token = req.cookies.communityToken;
            let communityId;
            try {
                const payload = this.jwt.verifyToken(token);
                if (payload) {
                    communityId = payload.id;
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
    async getEventsById(req: Request, res: Response) {
        try {
            const eventId = req.params.id;
            let event = await this.eventUsecase.getEventsById(eventId)
            if (!event) {
                res.status(401).json({ success: false, message: 'No event' });
            } else {
                res.status(200).json({ success: true, event })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async deleteEvent(req: Request, res: Response) {
        try {
            const eventId = req.params.id;
            let event = await this.eventUsecase.deleteEvent(eventId)
            if (!event) {
                res.status(401).json({ success: false, message: 'No event to delete' });
            } else {
                res.status(200).json({ success: true, event })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async editEvent(req: Request, res: Response) {
        try {
            const { id, formData } = req.body;
            const { name, volunteerCount, details, shifts, category, is_online } = formData;
            let parsedShifts;
            if (shifts) {
                parsedShifts = JSON.parse(shifts);
            }
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
            let communityId = req.communityId
            const eventData: Partial<events> = {
                ...(name && { name }),
                ...(details && { details }),
                ...(parsedShifts && { shifts: parsedShifts }),
                ...(images.length && { images }),
                ...(video && { video }),
                ...(volunteerCount && { volunteerCount }),
                ...(category && { category }),
                ...(is_online && { is_online }),
            };
            console.log(eventData);

            const updatedData = await this.eventUsecase.editEvent(id, eventData as Partial<events>);
            if (updatedData) {
                res.status(200).json({ success: true });
            } else {
                res.status(500).json({ success: false, message: 'Cannot Update Event!' });
            }
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getEventsFilteredByDateRange(req: Request, res: Response) {
        const { startDate, endDate } = req.query;
        try {
            const result = await this.eventUsecase.getEventsFilteredByDateRange(startDate as string, endDate as string);
            console.log(result)
            if (result) {
                res.status(200).json({ success: true, result })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error('Error getting events:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getEventsFilteredByCategory(req: Request, res: Response) {
        const { name } = req.query;
        try {
            const result = await this.eventUsecase.getEventsFilteredByCategory(name as string);
            console.log(result)
            if (result) {
                res.status(200).json({ success: true, result })
            } else {
                res.status(500).json({ success: false, message: "Internal server error" })
            }
        } catch (error) {
            console.error('Error getting events:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getEventsFilteredByDay(req: Request, res: Response) {
        const { date } = req.query;
        try {
            const result = await this.eventUsecase.getEventsFilteredByDay(date as any);
            if (result) {
                res.status(200).json({ success: true, result });
            } else {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        } catch (error) {
            console.error('Error getting events:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async searchEvents(req: Request, res: Response) {
        const { query } = req.query;
        try {
            const events = await this.eventUsecase.searchEvents(query as string);
            if (events) {
                res.status(200).json({ success: true, events });
            } else {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        } catch (error) {
            console.error('Error searching events:', error);
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    
}



export default eventController
