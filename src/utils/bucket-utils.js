import {axiosInstance as axios} from './axios-interceptor';
import { baseUrl } from './url';

export const getPresignedUrl = async (fileName) => {
    try {
        const response = await axios.get(`${baseUrl()}/api/generate-presigned-url`, {
            params: { fileName }
        });
        return response.data.signedUrl;
    } catch (error) {
        console.error('Error obtaining presigned URL', error);
        throw error;
    }
};

export const uploadFileToGCS = async (file, onProgress = () => {}) => {
    try {
        const url = await getPresignedUrl(file.name);
        if(!url){
            throw Error('Url not found')
        }
        const headers = {
            'Content-Type': file.type || 'application/octet-stream'
        };
        const result = await axios.put(url, file, { 
            headers,
            onUploadProgress: progressEvent => {
                if (progressEvent.lengthComputable) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted); // Callback to update progress in the UI
                }
            }
        });
        console.log('File uploaded successfully', result);
        onProgress(100); // Ensure the completion is set at the end
  
    
    } catch (error) {
        console.error('Failed to upload file', error);
        onProgress(0); // Reset or handle error state if progress callback is provided
    }
};
