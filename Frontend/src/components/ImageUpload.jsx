import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, className = '', initialImage = null }) => {
  const [uploadedImage, setUploadedImage] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Update uploadedImage when initialImage changes (for editing)
  useEffect(() => {
    setUploadedImage(initialImage);
  }, [initialImage]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setError('');

    // Only take the first file
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Kensim');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcf6fcka1/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cloudinary response:', response.status, errorData);
        throw new Error(`Upload failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const imageData = {
        id: data.public_id,
        url: data.secure_url,
        name: file.name,
        size: file.size
      };
      
      setUploadedImage(imageData);
      onImageUpload([imageData]);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const removeImage = () => {
    setUploadedImage(null);
    onImageUpload([]);
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <div className="upload-section">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="upload-status">
              <div className="spinner"></div>
              <p>Uploading image...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                {isDragActive
                  ? 'Drop the image here...'
                  : 'Drag & drop an image here, or click to select file'}
              </p>
              <p className="upload-hint">
                Supports: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {uploadedImage && (
        <div className="uploaded-images">
          <h4>Uploaded Image</h4>
          <div className="image-grid">
            <div className="image-item">
              <img src={uploadedImage.url} alt={uploadedImage.name} />
              <div className="image-overlay">
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-btn"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
              <div className="image-info">
                <p className="image-name">{uploadedImage.name}</p>
                <p className="image-size">{(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 