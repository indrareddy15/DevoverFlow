import React, { useCallback } from "react";
import { X } from "lucide-react";

interface Image {
  url?: string;
  file?: File;
  publicId?: string;
}

interface ImageUploadProps {
  images: Image[];
  onImagesChange: (images: Image[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  onRemove,
  maxImages = 5,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (images.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }
      const newImages = files.map((file) => ({ file }));
      onImagesChange([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (images.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }
      const newImages = files.map((file) => ({ file }));
      onImagesChange([...images, ...newImages]);
      e.target.value = "";
    },
    [images, maxImages, onImagesChange]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      >
        <input
          type="file"
          multiple
          name="images"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-indigo-600 hover:text-indigo-500"
        >
          Click to upload
        </label>
        <span className="text-gray-500"> or drag and drop</span>
        <p className="text-sm text-gray-500 mt-1">
          PNG, JPG, GIF up to 5MB (max {maxImages} images)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={
                  image.url || (image.file && URL.createObjectURL(image.file))
                }
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
