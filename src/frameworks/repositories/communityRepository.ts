import communityModel from "../database/communityModel";
import community from "../../entities/community";
import ICommunityInterface from "../../useCases/interfaces/ICommunityInterface";
import volunteerModel from "../database/volunteerModel";
import volunteer from "../../entities/volunteer";
import mongoose from "mongoose";

class communityRepository implements ICommunityInterface {
    async findCommunityByEmail(email: string): Promise<community | null> {
        try {
            let data = await communityModel.findOne({ email: email })
            return data ? data.toObject() : null
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch community')
        }

    }
    async saveCommunity(community: community): Promise<community | null> {
        try {
            let newComm = new communityModel(community)
            await newComm.save();
            return newComm ? newComm.toObject() : null

        } catch (error: any) {
            console.error(error.mesaage)
            throw new Error('Error while saving community data')
        }
    }
    async findCommunityById(id: string): Promise<community | null> {
        try {
            let data: community | null = await communityModel.findById(id)
            return data
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find community")
        }
    }
    async editCommunity(id: string, community: community): Promise<boolean> {
        try {
            let newData = await communityModel.updateOne({ _id: id }, community, { new: true })
            return newData.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update volunteer Details")
        }
    }
    async updateStatus(id: string, is_accepted: boolean, communityId: string): Promise<boolean> {
        try {
            const updateFields: any = { "volunteers.$[elem].is_accepted": is_accepted };
            if (is_accepted) {
                updateFields["volunteers.$[elem].date"] = new Date();
            }

            const updatedCommunity = await communityModel.findByIdAndUpdate(
                communityId,
                { $set: updateFields },
                { new: true, arrayFilters: [{ "elem.volunteerId": new mongoose.Types.ObjectId(id) }] }
            );

            const updatedVolunteer = await volunteerModel.findByIdAndUpdate(
                id,
                { $push: { communities: communityId } },
                { new: true }
            );

            if (!updatedCommunity || !updatedVolunteer) {
                throw new Error("Failed to update volunteer or community details");
            }

            return true;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update volunteer details");
        }
    }
    async getVolunteers(id: string): Promise<volunteer[] | null> {
        try {
            let data = await communityModel.findById(id).populate('volunteers.volunteerId');
            if (data) {
                const communityData = data.toObject();
                const acceptedVolunteers = communityData.volunteers.filter((vol: any) => vol.is_accepted).map((vol: any) => vol.volunteerId);
                console.log(acceptedVolunteers+"acc")
                return acceptedVolunteers;
            }
            return null;
        } catch (error: any) {
            console.error(error.message);
            throw new Error('unable to fetch list of volunteers');
        }
    }
}

export default communityRepository