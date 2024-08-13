"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
class Cloudinary {
    uploadImageToCloud(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cloudinary_1.v2.uploader.upload(image === null || image === void 0 ? void 0 : image.path, {
                    resource_type: "image"
                });
                return result.secure_url;
            }
            catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                throw error;
            }
        });
    }
    uploadVideoToCloud(video) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cloudinary_1.v2.uploader.upload(video === null || video === void 0 ? void 0 : video.path, {
                    resource_type: "video"
                });
                return result.secure_url;
            }
            catch (error) {
                console.error("Error uploading video to Cloudinary:", error);
                throw error;
            }
        });
    }
    uploadImagesArrayToCloud(images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadPromises = images.map((image) => __awaiter(this, void 0, void 0, function* () {
                    return yield this.uploadImageToCloud(image);
                }));
                const uploadedUrls = yield Promise.all(uploadPromises);
                return uploadedUrls;
            }
            catch (error) {
                console.error("Error uploading images array to Cloudinary:", error);
                throw error;
            }
        });
    }
}
exports.default = Cloudinary;
