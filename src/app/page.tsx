'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Github, Star, Zap, Shield, Globe } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import UploadHistory from '@/components/UploadHistory';

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleNewUpload = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Github className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Picser
                </h1>
                <p className="text-xs text-slate-500 font-medium">Free GitHub Image Hosting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/sh20raj/picser"
                target="_blank"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
              >
                <Star className="h-4 w-4" />
                <span>Star on GitHub</span>
              </Link>
              <Link
                href="/api-docs"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="h-4 w-4" />
                <span>API Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Free Image Hosting with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                GitHub + jsDelivr CDN
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Upload images to GitHub repositories and get lightning-fast CDN URLs via jsDelivr.
              Self-hostable, open-source, and completely free forever.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast CDN</h3>
                <p className="text-sm text-slate-600">jsDelivr CDN with global edge locations and heavy caching</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Permanent URLs</h3>
                <p className="text-sm text-slate-600">jsDelivr Commit-based URLs work even if repo/files are deleted*</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Self-Hostable</h3>
                <p className="text-sm text-slate-600">Deploy anywhere - Vercel, Cloudflare, or your own server</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id='upload' className="pb-16">
        <div className="container mx-auto px-6">
          <ImageUploader onUpload={handleNewUpload} />
          <UploadHistory key={refreshHistory} onNewUpload={() => setRefreshHistory(prev => prev + 1)} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Left Side - Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Github className="h-6 w-6 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Picser</h3>
                <p className="text-xs text-slate-500">Free GitHub Image Hosting</p>
              </div>
            </div>

            {/* Center - Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/api-docs"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                API Docs
              </Link>
              <Link
                href="https://github.com/sh20raj/picser"
                target="_blank"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                GitHub
              </Link>
              <Link
                href="https://jsdelivr.com"
                target="_blank"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                jsDelivr CDN
              </Link>
            </div>

            {/* Right Side - Attribution */}
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-600">
                Built with ❤️ by{' '}
                <Link
                  href="https://github.com/sh20raj"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  @sh20raj
                </Link>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Open source • Self-hostable • Free forever
              </p>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="border-t border-slate-200/50 mt-6 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 text-xs text-slate-500">
              <p>© 2025 Picser. Made with Next.js 15, TypeScript & Tailwind CSS.</p>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </span>
                <span>Powered by jsDelivr CDN</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
