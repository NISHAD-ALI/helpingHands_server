import Volunteer from "../../entities/volunteer";
import volunteerModel from "../database/volunteerModel";
import IVolunteerInterface from "../../useCases/interfaces/IVolunteerInterface";


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
    async findVolunteerById(id: string): Promise<Volunteer | null> {
        try {
            let volunteerdata: Volunteer | null = await volunteerModel.findById(id)
            return volunteerdata
        } catch (err) {
            console.log(err);
            throw new Error("Failed to find volunteer")
        }
    }
    async changePassword(email: string, password: string): Promise<boolean> {
        try {
            let volunteer = await volunteerModel.updateOne({email:email},{$set:{password:password}})
            return volunteer.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update password")
        }
    }
    async editVolunteer(id: string, volunteer: Volunteer): Promise<boolean> {
        try {
            let newData = await volunteerModel.updateOne({_id:id},volunteer,{new:true})
            return newData.acknowledged
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update volunteer Details")
        }
    }
}

export default volunteerRepository