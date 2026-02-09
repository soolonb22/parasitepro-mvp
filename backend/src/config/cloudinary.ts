import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (
  fileBuffer: Buffer,
  options: { folder?: string; public_id?: string } = {}
): Promise<{ url: string; thumbnailUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'parasitepro/analyses',
        public_id: options.public_id,
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
        eager: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
