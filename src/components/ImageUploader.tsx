'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { saveToHistory } from '@/utils/storage';

interface UploadResult {
    success: boolean;
    url: string;
    filename: string;
    size: number;
    type: string;
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
    const [copySuccess, setCopySuccess] = useState(false);

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
                // Save to history
                saveToHistory({
                    filename: result.filename,
                    url: result.url,
                    github_url: result.github_url,
                    size: result.size,
                    type: result.type,
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

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    }, [handleUpload]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const reset = () => {
        setUploadResult(null);
        setError(null);
        setPreviewFile(null);
        setCopySuccess(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Image Upload to GitHub
                </h1>
                <p className="text-gray-600">
                    Upload images and get shareable URLs hosted on GitHub
                </p>
            </div>

            {!uploadResult && !error && (
                <div>
                    {previewFile && (
                        <div className="mb-6 text-center">
                            <div className="inline-block relative">
                                <Image
                                    src={previewFile.url}
                                    alt="Preview"
                                    width={300}
                                    height={200}
                                    className="max-w-xs max-h-48 rounded-lg shadow-md object-contain"
                                    unoptimized
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                            <p className="text-sm">Uploading...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{previewFile.file.name}</p>
                        </div>
                    )}

                    <div
                        className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
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

                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

                        {uploading ? (
                            <div>
                                <p className="text-lg text-gray-600">Uploading to GitHub...</p>
                                <p className="text-sm text-gray-500 mt-1">Please wait while your image is being uploaded</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg text-gray-600 mb-2">
                                    {previewFile ? 'Upload another image' : 'Drop your image here or click to browse'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Supports: JPG, PNG, GIF, WebP (Max 10MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="text-red-800 font-medium">Upload Failed</h3>
                    </div>
                    <p className="text-red-700 mt-2">{error}</p>
                    <button
                        onClick={reset}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {uploadResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-green-800 font-medium">Upload Successful!</h3>
                    </div>

                    {uploadResult.url && (
                        <div className="mb-4 text-center">
                            <Image
                                src={uploadResult.url}
                                alt="Uploaded image"
                                width={200}
                                height={150}
                                className="max-w-xs max-h-32 rounded-lg shadow-md object-contain mx-auto"
                                unoptimized
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL:
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={uploadResult.url}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                                />
                                <button
                                    onClick={() => copyToClipboard(uploadResult.url)}
                                    className={`p-2 transition-colors ${copySuccess
                                            ? 'text-green-600 hover:text-green-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    title={copySuccess ? "Copied!" : "Copy URL"}
                                >
                                    {copySuccess ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>
                                <a
                                    href={uploadResult.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Filename:</span>
                                <p className="text-gray-600">{uploadResult.filename}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Size:</span>
                                <p className="text-gray-600">{formatFileSize(uploadResult.size)}</p>
                            </div>
                        </div>

                        {uploadResult.github_url && (
                            <div>
                                <a
                                    href={uploadResult.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    View on GitHub
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={reset}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Upload Another Image
                    </button>
                </div>
            )}
        </div>
    );
}
