const sharp = require('sharp');
const { Readable } = require('stream');
const s3 = require('../config/awsS3_config');
require('dotenv').config();

// Function to upload an image to S3 after processing
const uploadImage = async (filePath) => {
    try {
        // Process the image using sharp (resize, format)
        const transformedImageBuffer = await sharp(filePath)
            .toFormat('jpeg')
            .rotate(0)
            .toBuffer();

        // Create a readable stream from the transformed buffer
        const transformedImageStream = new Readable();
        transformedImageStream.push(transformedImageBuffer);
        transformedImageStream.push(null);

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `images/${Date.now()}_image.jpg`,
            Body: transformedImageStream,
            ContentType: 'image/jpeg',
        };

        // Upload the image to S3
        const data = await s3.upload(params).promise();
        return data.Location;

    } catch (error) {
        console.error('Error processing or uploading image:', error);
        throw new Error('Error handling image upload');
    }
};

module.exports = uploadImage;
