"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadImage = async (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: options.folder || 'parasitepro/analyses',
            public_id: options.public_id,
            transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
            eager: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve({
                    url: result.secure_url,
                    thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
                    publicId: result.public_id
                });
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadImage = uploadImage;
exports.default = cloudinary_1.v2;
