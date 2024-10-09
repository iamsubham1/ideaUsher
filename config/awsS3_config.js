const AWS = require('aws-sdk');
require('dotenv').config()

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_BUCKET_ACCESSKEY,
    secretAccessKey: process.env.S3_BUCKET_SECRETKEY,
    region: process.env.S3_BUCKET_REGION,
});





module.exports = s3;
