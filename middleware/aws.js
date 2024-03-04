const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key ID
    secretAccesskey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key
    region: "ap-south-1" 
})

module.exports = { AWS };