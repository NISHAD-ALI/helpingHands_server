import Volunteer from "../../entities/volunteer";
import volunteerModel from "../database/volunteerModel";
import IVolunteerInterface from "../../useCases/interfaces/IVolunteerInterface";
import communityModel from "../database/communityModel";
import mongoose, { ObjectId } from "mongoose";
import eventModel from "../database/eventModel";
import events from "../../entities/events";

class volunteerRepository implements IVolunteerInterface {
    async findvolunteerByEmail(email: string): Promise<Volunteer | null> {
        try {
            let volunteerData = await volunteerModel.findOne({ email: email })
            return volunteerData ? volunteerData.toObject() : null

        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch user data')
        }
    }
    async saveVolunteer(volunteer: Volunteer): Promise<Volunteer | null> {
        try {
            let newVolunteer = new volunteerModel(volunteer);
            await newVolunteer.save();
            return newVolunteer ? newVolunteer.toObject() : null;
        } catch (error: any) {
            console.error(error.message);
            throw new Error('unable to save volunteer data');
        }
    }
    async findVolunteerById(id: any): Promise<Volunteer | null> {
        try {
            let volunteerdata: Volunteer | null = await volunteerModel.findById(id)
            return volunteerdata
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find volunteer")
        }
    }
    async changePassword(password: string, id: string): Promise<boolean> {
        try {
            let volunteer = await volunteerModel.updateOne({ _id: id }, { $set: { password: password } })
            console.log("success")
            return volunteer.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update password")
        }
    }
    async editVolunteer(id: string, volunteer: Volunteer): Promise<boolean> {
        try {
            let newData = await volunteerModel.updateOne({ _id: id }, volunteer, { new: true })
            return newData.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update volunteer Details")
        }
    }
    async enrollToCommunity(communityId: string, volunteerId: string): Promise<boolean> {
        try {
            console.log(communityId, volunteerId)
            const volunteerObj = {
                volunteerId: new mongoose.Types.ObjectId(volunteerId),
                is_accepted: false
            };

            const result = await communityModel.findOneAndUpdate(
                {
                    _id: communityId,
                    "volunteers.volunteerId": { $ne: volunteerObj.volunteerId }
                },
                { $addToSet: { volunteers: volunteerObj } },
                { new: true }
            );

            if (!result) {
                console.error("Community not found");
                return false;
            }

            console.log("Volunteer enrollment updated successfully.");
            return true;
        } catch (error: any) {
            console.error("Error updating volunteer acceptance:", error.message);
            throw new Error('Failed to enroll volunteer to community');
        }
    }
    async findEvents(volunteerId: string):Promise<events[] | null> {
        try {
            const volunteer = await volunteerModel.findById(volunteerId).populate('communities');

            if (!volunteer) {
                throw new Error('Volunteer not found');
            }

            const communityIds = volunteer.communities.map((community: any) => community._id);
            const events = await eventModel.find({ communId: { $in: communityIds } });

            return events
        } catch (error) {
            console.log(error);
            throw new Error('Failed to get volunteer community events');
        }
    }
    
    async enrollToEvents(volunteerId: string, eventId: string): Promise<boolean> {
        try {
            const volunteer = await volunteerModel.findById(volunteerId);

            if (!volunteer) {
                throw new Error('Volunteer not found');
            }
            const eventObjectId = new mongoose.Types.ObjectId(eventId).toString();

            if (volunteer.events.map(event => event.toString()).includes(eventObjectId)) {
                throw new Error('Volunteer is already enrolled in this event');
            }
            
            const addToEvent = await volunteerModel.findByIdAndUpdate(
                volunteerId,
                { $push: { events: eventId } },
                { new: true }
            );

            if (!addToEvent) {
                throw new Error('Failed to add volunteer to event');
            }

            return true;
        } catch (error) {
            console.error('Error enrolling volunteer to event:', error);
            throw new Error('Failed to add volunteer to event');
        }

    }
}

export default volunteerRepository