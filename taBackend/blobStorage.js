const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');



async function uploadText(text)
{
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        "DefaultEndpointsProtocol=https;AccountName=tema3;AccountKey=pBXgAF+WI2fV9Gc5nvBoSFw3VB7ZFnmmWqf5HAL3209G8aLVTTXDOB0Kk3MpTfzQdTWuxr3iXydwwfminhW8uQ==;EndpointSuffix=core.windows.net"
    );
    const containerName = 'tema3';
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = uuidv1()+".txt";
    const blobClient =  containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blobClient.upload(text, text.length);
    //return blob url
    return blobClient.url;
}

module.exports = {uploadText};