// Updated cropImage utility
export function getCroppedImg(url, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      
      // Final dimensions for the ad - full width and 200px height
      // Using a reasonable width that will be stretched in the preview
      const finalWidth = 1200; // This will be stretched to container width
      const finalHeight = 200;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      const ctx = canvas.getContext("2d");

      // Draw the cropped area, stretched to fill the final dimensions
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        finalWidth,
        finalHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = "cropped.jpg";
        resolve(blob);
      }, "image/jpeg", 0.9);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
}