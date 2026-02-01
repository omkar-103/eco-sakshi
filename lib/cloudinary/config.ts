// lib/cloudinary/config.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
}

export async function uploadToCloudinary(
  file: string, // Base64 or URL
  folder: string = 'greensentinel/reports',
  resourceType: 'image' | 'video' = 'image'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resourceType,
      transformation: resourceType === 'image' 
        ? [{ quality: 'auto:good', fetch_format: 'auto' }]
        : undefined,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      metadata: {
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      },
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}