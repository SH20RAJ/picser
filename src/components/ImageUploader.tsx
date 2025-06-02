'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Copy, ExternalLink, CheckCircle, AlertCircle, Zap, Star, Link as LinkIcon } from 'lucide-react';
import { saveToHistory } from '@/utils/storage';

interface UploadResult {
    success: boolean;
    url: string;
    urls?: {
        github: string;
        raw: string;
        jsdelivr: string;
        github_commit: string;
        raw_commit: string;
        jsdelivr_commit: string;
    };
    filename: string;
    size: number;
    type: string;
    commit_sha?: string;
    github_url?: string;
    error?: string;
}

interface PreviewFile {
    file: File;
    url: string;
}

interface ImageUploaderProps {
    onUpload?: () => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps = {}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleUpload = useCallback(async (file: File) => {
        setUploading(true);
        setError(null);
        setUploadResult(null);

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewFile({ file, url: previewUrl });

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setUploadResult(result);
                // Save to history with jsDelivr CDN URL as primary
                saveToHistory({
                    filename: result.filename,
                    url: result.urls?.jsdelivr_commit || result.url,
                    github_url: result.github_url,
                    size: result.size,
                    type: result.type,
                    urls: result.urls,
                });
                // Notify parent component
                onUpload?.();
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, [onUpload]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleUpload(file);
            } else {
                setError('Please select an image file');
            }
        }
    }, [handleUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUpload(files[0]);
        }
    }, [handleUpload]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedUrl(text);
            setTimeout(() => setCopiedUrl(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const resetUpload = () => {
        setUploadResult(null);
        setError(null);
        setPreviewFile(null);
        setCopiedUrl(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
                        <Upload className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Upload Your Images
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Get instant CDN URLs via jsDelivr with global caching and permanent links
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {uploadResult ? (
                    <div className="space-y-6">
                        {/* Success Message */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Successful!</h3>
                            <p className="text-slate-600">Your image is now available on the global CDN</p>
                        </div>

                        {/* Image Preview */}
                        <div className="text-center">
                            <div className="inline-block relative">
                                <Image
                                    src={uploadResult.urls?.jsdelivr_commit || uploadResult.url}
                                    alt="Uploaded image"
                                    width={300}
                                    height={200}
                                    className="max-w-sm max-h-64 rounded-xl shadow-lg object-contain border border-slate-200"
                                    unoptimized
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    CDN Ready
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-600">
                                <p className="font-medium">{uploadResult.filename}</p>
                                <p>{formatFileSize(uploadResult.size)} • {uploadResult.type}</p>
                            </div>
                        </div>

                        {/* Primary CDN URL */}
                        {uploadResult.urls?.jsdelivr_commit && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="h-5 w-5 text-blue-600" />
                                        <h4 className="font-semibold text-blue-900">Recommended: jsDelivr CDN URL</h4>
                                    </div>
                                    <Star className="h-4 w-4 text-yellow-500 ml-2" />
                                </div>
                                <p className="text-sm text-blue-700 mb-4">
                                    ⚡ Lightning fast global CDN • 🔒 Permanent commit-based URL • 📈 Heavy caching
                                </p>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={uploadResult.urls.jsdelivr_commit}
                                        readOnly
                                        className="flex-1 px-4 py-3 border border-blue-300 rounded-lg text-sm bg-white/80 font-mono text-slate-800"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(uploadResult.urls!.jsdelivr_commit)}
                                        className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        {copiedUrl === uploadResult.urls.jsdelivr_commit ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                    <a
                                        href={uploadResult.urls.jsdelivr_commit}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Alternative URLs */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Alternative URLs
                            </h4>

                            <div className="grid gap-4">
                                {/* Raw GitHub URL (Commit-based) */}
                                {uploadResult.urls?.raw_commit && (
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700">Raw GitHub URL (Permanent)</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Permanent</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={uploadResult.urls.raw_commit}
                                                readOnly
                                                className="flex-1 px-3 py-2 border text-amber-950 border-slate-300 rounded text-xs bg-white font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(uploadResult.urls!.raw_commit)}
                                                className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                {copiedUrl === uploadResult.urls.raw_commit ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* jsDelivr Branch URL */}
                                {uploadResult.urls?.jsdelivr && (
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700">jsDelivr CDN (Branch-based)</span>
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Dynamic</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={uploadResult.urls.jsdelivr}
                                                readOnly
                                                className="flex-1 px-3 py-2 border text-amber-950 border-slate-300 rounded text-xs bg-white font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(uploadResult.urls!.jsdelivr)}
                                                className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                {copiedUrl === uploadResult.urls.jsdelivr ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* GitHub URL */}
                                {uploadResult.urls?.github_commit && (
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700">GitHub Repository URL</span>
                                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Source</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={uploadResult.urls.github_commit}
                                                readOnly
                                                className="flex-1 px-3 py-2 border text-amber-950 border-slate-300 rounded text-xs bg-white font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(uploadResult.urls!.github_commit)}
                                                className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                {copiedUrl === uploadResult.urls.github_commit ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload Another Button */}
                        <div className="text-center pt-4">
                            <button
                                onClick={resetUpload}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Upload Another Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {previewFile && (
                            <div className="mb-8 text-center">
                                <div className="inline-block relative">
                                    <Image
                                        src={previewFile.url}
                                        alt="Preview"
                                        width={300}
                                        height={200}
                                        className="max-w-sm max-h-64 rounded-xl shadow-lg object-contain border border-slate-200"
                                        unoptimized
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent mx-auto mb-3"></div>
                                                <p className="font-medium">Uploading to GitHub...</p>
                                                <p className="text-sm opacity-90">Generating CDN URLs</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mt-3 font-medium">{previewFile.file.name}</p>
                            </div>
                        )}

                        <div
                            className={`
                                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
                                ${isDragging
                                    ? 'border-blue-400 bg-blue-50/50 scale-105'
                                    : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'
                                }
                                ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            `}
                            onDragEnter={handleDragIn}
                            onDragLeave={handleDragOut}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />

                            <div className="space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
                                    </h3>
                                    <p className="text-slate-600">
                                        Supports JPG, PNG, GIF, WebP up to 100MB
                                    </p>
                                </div>

                                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                                    <div className="flex items-center space-x-1">
                                        <Zap className="h-4 w-4" />
                                        <span>CDN Powered</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Permanent URLs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
