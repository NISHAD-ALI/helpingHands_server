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
class eventController {
    constructor(eventUsecase, jwt) {
        this.eventUsecase = eventUsecase;
        this.jwt = jwt;
    }
    createEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, volunteerCount, details, shifts, category, is_online, city } = req.body;
                const parsedShifts = JSON.parse(shifts);
                let filesInfo = [];
                if (Array.isArray(req.files)) {
                    req.files.forEach((file) => {
                        const fileInfo = {
                            filename: file.originalname,
                            mimetype: file.mimetype,
                            path: file.path
                        };
                        filesInfo.push(fileInfo);
                    });
                }
                let images = [];
                let video = null;
                filesInfo.forEach((fileInfo) => {
                    if (fileInfo.mimetype.startsWith('image/')) {
                        images.push(fileInfo);
                    }
                    else if (fileInfo.mimetype.startsWith('video/')) {
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
                    }
                    else {
                        throw new Error('Invalid token or missing payload');
                    }
                }
                catch (error) {
                    console.error('Error verifying token:', error);
                    return res.status(401).json({ success: false, message: 'Invalid token' });
                }
                const eventData = {
                    name,
                    details,
                    shifts: parsedShifts,
                    images,
                    video: video || '',
                    volunteerCount,
                    communId: communityId,
                    category: category,
                    is_online: is_online,
                    city: city
                };
                const newData = yield this.eventUsecase.createEvent(eventData);
                if (newData) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Cannot Create Event!' });
                }
            }
            catch (error) {
                console.error('Error creating event:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.communityToken;
                let communityId;
                try {
                    const payload = this.jwt.verifyToken(token);
                    if (payload) {
                        communityId = payload.id;
                        console.log(communityId);
                    }
                    else {
                        throw new Error('Invalid token or missing payload');
                    }
                }
                catch (error) {
                    console.error('Error verifying token:', error);
                    return res.status(401).json({ success: false, message: 'Invalid token' });
                }
                let events = yield this.eventUsecase.getAllEvents(communityId);
                if (events) {
                    res.status(200).json({ success: true, events });
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
    getEventsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                let event = yield this.eventUsecase.getEventsById(eventId);
                if (!event) {
                    res.status(401).json({ success: false, message: 'No event' });
                }
                else {
                    res.status(200).json({ success: true, event });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                let event = yield this.eventUsecase.deleteEvent(eventId);
                if (!event) {
                    res.status(401).json({ success: false, message: 'No event to delete' });
                }
                else {
                    res.status(200).json({ success: true, event });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("-------------------------------------");
                const { id, formData } = req.body;
                const { name, volunteerCount, details, shifts, category, is_online } = formData;
                console.log(req.files);
                let parsedShifts;
                if (shifts) {
                    parsedShifts = JSON.parse(shifts);
                }
                let filesInfo = [];
                if (Array.isArray(req.files)) {
                    req.files.forEach((file) => {
                        const fileInfo = {
                            filename: file.originalname,
                            mimetype: file.mimetype,
                            path: file.path
                        };
                        filesInfo.push(fileInfo);
                    });
                }
                let images = [];
                let video = null;
                filesInfo.forEach((fileInfo) => {
                    if (fileInfo.mimetype.startsWith('image/')) {
                        images.push(fileInfo);
                    }
                    else if (fileInfo.mimetype.startsWith('video/')) {
                        video = fileInfo;
                    }
                });
                let communityId = req.communityId;
                const eventData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (details && { details })), (parsedShifts && { shifts: parsedShifts })), (images.length && { images })), (video && { video })), (volunteerCount && { volunteerCount })), (category && { category })), (is_online && { is_online }));
                console.log(eventData);
                const updatedData = yield this.eventUsecase.editEvent(id, eventData);
                if (updatedData) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Cannot Update Event!' });
                }
            }
            catch (error) {
                console.error('Error updating event:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEventsFilteredByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = req.query;
            console.log(startDate, endDate);
            try {
                const result = yield this.eventUsecase.getEventsFilteredByDateRange(startDate, endDate);
                console.log(result);
                if (result) {
                    res.status(200).json({ success: true, result });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error('Error getting events:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEventsFilteredByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            console.log(name);
            try {
                const result = yield this.eventUsecase.getEventsFilteredByCategory(name);
                console.log(result);
                if (result) {
                    res.status(200).json({ success: true, result });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error('Error getting events:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEventsFilteredByDay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.query;
            try {
                // const utcDate = new Date(date as string);
                console.log(date);
                const result = yield this.eventUsecase.getEventsFilteredByDay(date);
                console.log(result);
                if (result) {
                    res.status(200).json({ success: true, result });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error('Error getting events:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    searchEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            try {
                const events = yield this.eventUsecase.searchEvents(query);
                console.log(events);
                if (events) {
                    res.status(200).json({ success: true, events });
                }
                else {
                    res.status(500).json({ success: false, message: "Internal server error" });
                }
            }
            catch (error) {
                console.error('Error searching events:', error);
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = eventController;
