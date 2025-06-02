'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Copy, ExternalLink, Trash2, CheckCircle, Zap, Star } from 'lucide-react';
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

    // Get the best URL for display (prioritize jsDelivr CDN)
    const getBestUrl = (upload: UploadHistory) => {
        if (upload.urls?.jsdelivr_commit) return upload.urls.jsdelivr_commit;
        if (upload.urls?.jsdelivr) return upload.urls.jsdelivr;
        return upload.url;
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl">
                            <Clock className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Upload History</h2>
                            <p className="text-slate-600">{history.length} image{history.length !== 1 ? 's' : ''} uploaded</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClearHistory}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Clear All</span>
                    </button>
                </div>

                {/* Upload Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((upload) => {
                        const bestUrl = getBestUrl(upload);
                        const isCDN = bestUrl.includes('jsdelivr.net');
                        const isPermanent = upload.urls?.jsdelivr_commit || upload.urls?.raw_commit;

                        return (
                            <div
                                key={upload.id}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
                            >
                                {/* Image */}
                                <div className="aspect-video relative bg-slate-50">
                                    <Image
                                        src={bestUrl}
                                        alt={upload.filename}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                                        unoptimized
                                    />
                                    {/* URL Type Badge */}
                                    <div className="absolute top-2 right-2">
                                        {isCDN && (
                                            <div className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                <Zap className="h-3 w-3" />
                                                <span>CDN</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Permanent Badge */}
                                    {isPermanent && (
                                        <div className="absolute top-2 left-2">
                                            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                <Star className="h-3 w-3" />
                                                <span>Permanent</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {/* File Info */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 truncate text-sm">
                                            {upload.filename}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                                            <span>{formatFileSize(upload.size)}</span>
                                            <span>{formatDate(upload.uploadDate)}</span>
                                        </div>
                                    </div>

                                    {/* Primary URL (jsDelivr CDN preferred) */}
                                    {upload.urls?.jsdelivr_commit && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-blue-700 flex items-center space-x-1">
                                                    <Zap className="h-3 w-3" />
                                                    <span>jsDelivr CDN (Permanent)</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={upload.urls.jsdelivr_commit}
                                                    readOnly
                                                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono text-slate-700"
                                                />
                                                <button
                                                    onClick={() => copyToClipboard(upload.urls!.jsdelivr_commit, `${upload.id}-jsdelivr`)}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Copy jsDelivr CDN URL"
                                                >
                                                    {copiedId === `${upload.id}-jsdelivr` ? (
                                                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                                <a
                                                    href={upload.urls.jsdelivr_commit}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Open in new tab"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* GitHub URL */}
                                    {upload.github_url && (
                                        <div className="pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                                                <span>GitHub Repository</span>
                                                <a
                                                    href={upload.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                                >
                                                    <span>View Source</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
