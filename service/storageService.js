import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Google Cloud Storage configuration
const projectId = 'dmcd-demo';
const keyFilename = 'myKey';
const bucketName = 'your-bucket-name';

const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(bucketName);

// Function to upload file to GCS
export const uploadFileToGCS = (file) => new Promise((resolve, reject) => {
    if (!file) {
        reject('No file provided.');
        return;
    }

    const gcsFileName = `${uuidv4()}-${file.originalname}`;
    const gcsFile = bucket.file(gcsFileName);

    const stream = gcsFile.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    stream.on('error', (error) => reject(error));

    stream.on('finish', async () => {
        await gcsFile.makePublic();
        resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`);
    });

    stream.end(file.buffer);
});