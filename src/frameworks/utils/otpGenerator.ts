class OtpGenerator{
    generateOTP(): string {
       const otp: number = Math.floor(10000 + Math.random() * 90000);
       return otp.toString();
   }
}

export default OtpGenerator

