 export const getFileNameFromURL = (url) => {
    const fileNameWithPrefix = url.substring(url.lastIndexOf('/') + 1);
    const fileName = fileNameWithPrefix.substring(fileNameWithPrefix.indexOf('_') + 1); 
    return fileName;
  };

  export const getFileExtensionFromURL = (url) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
    return extension;
  };

 export const getFileSizeFromURL = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentLength = response.headers.get('Content-Length');
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return null;
    }
  };

 export const getFileSubNameFromURL = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };


  const [items, setItems] = ([
    {
      id: 1,
      fileName: "file1.txt",
      timestamp: "2024-05-23 10:00",
      size: "15KB",
      language: "EN",
      noOfSpeakers: 1,
      audioType: "General",
    },
  ]);
  