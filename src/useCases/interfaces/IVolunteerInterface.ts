import volunteer from "../../entities/volunteer"

interface IVolunteerInterface {
    findvolunteerByEmail(email: string): Promise<volunteer | null>
    saveVolunteer(volunteer: volunteer): Promise<volunteer | null>,
    findVolunteerById(id: string): Promise<volunteer | null>,
    changePassword(email:string,password:string):Promise<boolean>,
    editVolunteer(id: string, volunteer: volunteer): Promise<boolean>
}

export default IVolunteerInterface