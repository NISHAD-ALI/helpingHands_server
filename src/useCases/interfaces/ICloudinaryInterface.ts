interface ICloudinary{
    uploadImageToCloud(image:any):Promise<string>;
    uploadVideoToCloud(video:any):Promise<string>;
    uploadImagesArrayToCloud(images: any[]): Promise<string[]>;
}
export default ICloudinary;