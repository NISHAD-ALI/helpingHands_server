import bcrypt from 'bcrypt'


class HashPassword{
    async hashPassword(password:string){
       try {
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword
       } catch (error) {
         console.error('Error while hashing Password',error)
         throw error
       }
    }
    async comparePassword(password:string,hashed:string){
         try {
            const 
         } catch (error) {
            
         }
    }
    
}