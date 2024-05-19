interface ICloudinary{
    uploadToCloud(file:any):Promise<string>;
}
export default ICloudinary;