import { Request, Response } from "express";
import eventUsecase from "../useCases/eventUsecase";
import eventModel from "../frameworks/database/eventModel";
import events from "../entities/events";

class eventController {
    private eventUsecase: eventUsecase
    constructor(eventUsecase: eventUsecase) {
        this.eventUsecase = eventUsecase
    }
    async createEvents(req: Request, res: Response) {
        try {
            const { name, volunteers, details, shifts } = req.body;
            const parsedShifts = JSON.parse(shifts);
            let images: string[] = [];
            let video: string | null = null;

            if (Array.isArray(req.files)) {
                req.files.forEach((file: Express.Multer.File) => {
                    const filePath = file.path;
                    if (file.mimetype.startsWith('image/')) {
                        images.push(filePath);
                    } else if (file.mimetype.startsWith('video/')) {
                        video = filePath;
                    }
                });
            }
            console.log('Images:', images);
            console.log('Video:', video);
             let a = localStorage.getItem('communityData')
             console.log(a+"objid");
             
            const eventData: events = {
                name,
                volunteers,
                details,
                shifts: parsedShifts,
                images,
                video: video || '',
                communId , 
                volunteerCount,
            };
            const newData = await this.eventUsecase.createEvent(eventData as events)
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}


export default eventController
