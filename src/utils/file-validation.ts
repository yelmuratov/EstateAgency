export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check if file is an image or video
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      isValid: false,
      error: 'Файл должен быть изображением (JPEG, PNG, GIF) или видео (MP4, MOV, AVI)',
    };
  }

  // Check file size
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `${isImage ? 'Изображение' : 'Видео'} не должно превышать ${
        isImage ? '5MB' : '30MB'
      }`,
    };
  }

  return { isValid: true };
}

