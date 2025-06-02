'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Copy, ExternalLink, Trash2, CheckCircle } from 'lucide-react';
import { getHistory, clearHistory, type UploadHistory } from '@/utils/storage';

interface UploadHistoryProps {
    onNewUpload?: () => void;
}

export default function UploadHistoryComponent({ onNewUpload }: UploadHistoryProps) {
    const [history, setHistory] = useState<UploadHistory[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, [onNewUpload]);

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear all upload history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Upload History</h2>
                    <span className="ml-2 text-sm text-gray-500">({history.length})</span>
                </div>
                <button
                    onClick={handleClearHistory}
                    className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((upload) => (
                    <div
                        key={upload.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Image
                                    src={upload.url}
                                    alt={upload.filename}
                                    width={80}
                                    height={60}
                                    className="w-20 h-15 object-cover rounded-md"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {upload.filename}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(upload.uploadDate)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {formatFileSize(upload.size)} • {upload.type}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={upload.url}
                                        readOnly
                                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(upload.url, upload.id)}
                                        className={`p-1 transition-colors ${copiedId === upload.id
                                                ? 'text-green-600 hover:text-green-700'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        title={copiedId === upload.id ? "Copied!" : "Copy URL"}
                                    >
                                        {copiedId === upload.id ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </button>
                                    <a
                                        href={upload.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                        title="Open in new tab"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
