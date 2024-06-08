import events from "../../entities/events"
import volunteer from "../../entities/volunteer"

interface IVolunteerInterface {
    findvolunteerByEmail(email: string): Promise<volunteer | null>
    saveVolunteer(volunteer: volunteer): Promise<volunteer | null>,
    findVolunteerById(id: any): Promise<volunteer | null>,
    changePassword(password:string,id:string):Promise<boolean>,
    editVolunteer(id: string, volunteer: volunteer): Promise<boolean>,
     enrollToCommunity(communityId: string, volunteerId: string): Promise<boolean>,
     findEvents(volunteerId: string):Promise<events[] | null>,
     enrollToEvents(volunteerId: string, eventId: string): Promise<boolean>,
}

export default IVolunteerInterface