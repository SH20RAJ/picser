'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Github } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import UploadHistory from '@/components/UploadHistory';

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleNewUpload = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Picser</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/api-docs"
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>API Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <ImageUploader onUpload={handleNewUpload} />
          <UploadHistory key={refreshHistory} onNewUpload={() => setRefreshHistory(prev => prev + 1)} />
        </div>
      </div>
    </div>
  );
}
