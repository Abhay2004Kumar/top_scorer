// Updated: imageupload.controller.js
import cloudinary from 'cloudinary';

// cloudinary.v2.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const uploadonCloudinary = async (file, foldername) => {
  try {
    return await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: foldername,
      resource_type: 'auto',
    });
  } catch (err) {
    console.error('Upload Error:', err);
    throw new Error('Cloudinary upload failed');
  }
};

const imageupload = async (file) => {
  if (!file) throw new Error('Image file is required.');

  const supportedFormats = ['jpeg', 'png', 'jpg'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!supportedFormats.includes(ext)) {
    throw new Error('Invalid file format. Only jpeg, png, and jpg are supported.');
  }

  const cloud = await uploadonCloudinary(file, 'Sport Blogs');
  return cloud;
};

export { imageupload };
