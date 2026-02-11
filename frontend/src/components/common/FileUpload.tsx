/**
 * FileUpload Component
 * Drag and drop file upload component
 */

import { useState } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
}

export function FileUpload({ onFilesChange, multiple = true }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesChange(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      onFilesChange(files);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-subtle-dark/30 dark:border-subtle-light/30 bg-subtle-light/50 dark:bg-subtle-dark/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full mb-4">
        <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
      </div>
      <p className="font-semibold text-foreground-light dark:text-foreground-dark">
        Drag &amp; drop files here
      </p>
      <p className="text-sm text-foreground-light/60 dark:text-foreground-dark/60">
        or click to upload
      </p>
      <input
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
}
