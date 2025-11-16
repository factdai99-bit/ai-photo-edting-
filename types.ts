
export interface EditedImageResult {
  base64Image: string;
  mimeType: string;
}

export interface EditHistoryItem {
  id: string;
  originalImageBase64: string;
  originalImageMimeType: string;
  prompt: string;
  editedImage: string; // This is a data URL
}
