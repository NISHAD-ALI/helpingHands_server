interface InodeMailerInterface{
    sendMail(to:string,otp:string):Promise<any>
}

export default InodeMailerInterface