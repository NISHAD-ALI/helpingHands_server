import { v2 } from "cloudinary";
import ICloudinary from "../../useCases/interfaces/ICloudinaryInterface";

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

class Cloudinary implements ICloudinary {
    async uploadImageToCloud(image: any): Promise<string> {
        try {
            const result = await v2.uploader.upload(image?.path, {
                resource_type: "image"
            });
            console.log(result); 
            return result.secure_url; 
        } catch (error: any) {
            console.error("Error uploading image to Cloudinary:", error);
            throw error; 
        }
    }

    async uploadVideoToCloud(video: any): Promise<string> {
        try {
 
            const result = await v2.uploader.upload(video?.path, {
                resource_type: "video"
            });
            console.log(result);
            return result.secure_url; 
        } catch (error: any) {
            console.error("Error uploading video to Cloudinary:", error);
            throw error; 
        }
    }
    async uploadImagesArrayToCloud(images: any[]): Promise<string[]> {
        try {
            const uploadPromises = images.map(async (image) => {
                return await this.uploadImageToCloud(image);
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            console.log("Uploaded image URLs:", uploadedUrls);
            return uploadedUrls;
        } catch (error: any) {
            console.error("Error uploading images array to Cloudinary:", error);
            throw error;
        }
    }
}

export default Cloudinary;
