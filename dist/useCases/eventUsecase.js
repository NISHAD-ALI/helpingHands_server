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
class eventUsecase {
    constructor(eventRepo, cloudinary, jwt) {
        this.eventRepo = eventRepo;
        this.cloudinary = cloudinary;
        this.jwt = jwt;
    }
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let images = eventData.images;
                let video = eventData.video;
                let uploadVideo = yield this.cloudinary.uploadVideoToCloud(eventData.video);
                eventData.video = uploadVideo;
                let uploadImages = yield this.cloudinary.uploadImagesArrayToCloud(images);
                eventData.images = uploadImages;
                let response = yield this.eventRepo.createEvent(eventData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.eventRepo.getEvents(id);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEventsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.eventRepo.getEventsById(id);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.eventRepo.deleteEvent(id);
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    editEvent(id, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let images = eventData.images;
                let video = eventData.video;
                if (video) {
                    let uploadVideo = yield this.cloudinary.uploadVideoToCloud(eventData.video);
                    eventData.video = uploadVideo;
                }
                if (images && images.length > 0) {
                    let uploadImages = yield this.cloudinary.uploadImagesArrayToCloud(images);
                    eventData.images = uploadImages;
                }
                let response = yield this.eventRepo.editEvent(id, eventData);
                return response;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEventsFilteredByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let start = startDate ? new Date(startDate) : undefined;
                let end = endDate ? new Date(endDate) : undefined;
                const events = yield this.eventRepo.getEventsFilteredByDateRange(start, end);
                return events;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEventsFilteredByCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield this.eventRepo.getEventsFilteredByCategory(name);
                return events;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEventsFilteredByDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newDate = new Date(date);
                console.log(newDate);
                const events = yield this.eventRepo.getEventsFilteredByDay(newDate);
                return events;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    searchEvents(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(query);
                const events = yield this.eventRepo.searchEvents(query);
                return events;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = eventUsecase;
