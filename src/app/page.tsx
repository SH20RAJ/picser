'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import UploadHistory from '@/components/UploadHistory';

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleNewUpload = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <ImageUploader onUpload={handleNewUpload} />
        <UploadHistory key={refreshHistory} onNewUpload={() => setRefreshHistory(prev => prev + 1)} />
      </div>
    </div>
  );
}
