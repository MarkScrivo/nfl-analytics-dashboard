import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = text.split('\n').map(row => row.split(','));
      onFileUpload(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <label className="cursor-pointer flex flex-col items-center">
        <Upload className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-lg font-medium text-gray-600">Drop your CSV file here</span>
        <span className="text-sm text-gray-500">or click to browse</span>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};