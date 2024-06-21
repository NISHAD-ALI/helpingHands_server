import community from "../entities/community";
import events from "../entities/events";
import Cloudinary from "../frameworks/utils/cloudinary";
import IEventInterface from "./interfaces/IEventInterface";
import Jwt from "../frameworks/utils/jwtAuth";
import jwt, { JwtPayload } from 'jsonwebtoken'

class eventUsecase {
    private eventRepo: IEventInterface;
    private cloudinary: Cloudinary;
    private jwt: Jwt;
    constructor(eventRepo: IEventInterface,cloudinary: Cloudinary, jwt: Jwt) {
        this.eventRepo = eventRepo
        this.cloudinary = cloudinary
        this.jwt = jwt
    }
    async createEvent(eventData : events){
        try {
            let images = eventData.images
            let video = eventData.video
            
            let uploadVideo = await this.cloudinary.uploadVideoToCloud(eventData.video)
            eventData.video = uploadVideo
            let uploadImages = await this.cloudinary.uploadImagesArrayToCloud(images)
            eventData.images = uploadImages
            let response = await this.eventRepo.createEvent(eventData)
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getAllEvents(id:string){
        try {
            let data = await this.eventRepo.getEvents(id)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getEventsById(id:string){
        try {
            let data = await this.eventRepo.getEventsById(id)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteEvent(id:string){
        try {
            let data = await this.eventRepo.deleteEvent(id)
            return data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async editEvent(id: string, eventData: Partial<events>) {
        try {
            let images = eventData.images;
            let video = eventData.video;
    
            if (video) {
                let uploadVideo = await this.cloudinary.uploadVideoToCloud(eventData.video);
                eventData.video = uploadVideo;
            }
    
            if (images && images.length > 0) {
                let uploadImages = await this.cloudinary.uploadImagesArrayToCloud(images);
                eventData.images = uploadImages;
            }
    
            let response = await this.eventRepo.editEvent(id, eventData);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getEventsFilteredByDateRange(startDate:string, endDate:string){
        try {
             let start: Date | undefined = startDate ? new Date(startDate) : undefined;
             let end: Date | undefined = endDate ? new Date(endDate) : undefined;
            const events = await this.eventRepo.getEventsFilteredByDateRange(start, end);
            return events
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getEventsFilteredByCategory(name:string){
        try {
            const events = await this.eventRepo.getEventsFilteredByCategory(name);
            return events
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getEventsFilteredByDay(date:string){
        try {
             let newDate: Date  = new Date(date) 
             console.log(newDate)
            const events = await this.eventRepo.getEventsFilteredByDay(newDate);
            return events
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async searchEvents(query:string){
        try {
             console.log(query)
            const events = await this.eventRepo.searchEvents(query);
            return events
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default eventUsecase