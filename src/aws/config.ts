import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your_access_key_id',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_access_key',
    },
});