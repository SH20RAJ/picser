export interface UploadHistory {
    id: string;
    filename: string;
    url: string;
    urls?: {
        github: string;
        raw: string;
        jsdelivr: string;
        github_commit: string;
        raw_commit: string;
        jsdelivr_commit: string;
    };
    github_url?: string;
    uploadDate: string;
    size: number;
    type: string;
}

const STORAGE_KEY = 'picser_upload_history';

export const saveToHistory = (upload: Omit<UploadHistory, 'id' | 'uploadDate'>) => {
    if (typeof window === 'undefined') return;

    const history = getHistory();
    const newUpload: UploadHistory = {
        ...upload,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString(),
    };

    const updatedHistory = [newUpload, ...history].slice(0, 50); // Keep last 50 uploads
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newUpload;
};





export const getHistory = (): UploadHistory[] => {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const clearHistory = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};
