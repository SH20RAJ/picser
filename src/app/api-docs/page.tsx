'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Upload, Code, Github, Home, Zap, Shield, Globe } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function APIDocumentation() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        githubToken: '',
        githubOwner: 'sh20raj',
        githubRepo: 'picser',
        githubBranch: 'main',
        folder: 'uploads'
    });

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const generateCurlExample = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://picser.pages.dev';
        return `curl -X POST \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@/path/to/your/image.png" \\
  -F "github_token=${formData.githubToken || 'ghp_xxxxxxxxxxxx'}" \\
  -F "github_owner=${formData.githubOwner}" \\
  -F "github_repo=${formData.githubRepo}" \\
  -F "github_branch=${formData.githubBranch}" \\
  -F "folder=${formData.folder}" \\
  ${baseUrl}/api/public-upload

# Or use the hosted version directly:
# https://picser.pages.dev/api/public-upload`;
    };

    const generateJavaScriptExample = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://picser.pages.dev';
        return `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('github_token', '${formData.githubToken || 'ghp_xxxxxxxxxxxx'}');
formData.append('github_owner', '${formData.githubOwner}');
formData.append('github_repo', '${formData.githubRepo}');
formData.append('github_branch', '${formData.githubBranch}');
formData.append('folder', '${formData.folder}');

// Use your own instance or the hosted version
const response = await fetch('${baseUrl}/api/public-upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);

// Or use hosted version directly:
// const response = await fetch('https://picser.pages.dev/api/public-upload', {...});`;
    };

    const generatePythonExample = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://picser.pages.dev';
        return `import requests

files = {'file': open('/path/to/your/image.png', 'rb')}
data = {
    'github_token': '${formData.githubToken || 'ghp_xxxxxxxxxxxx'}',
    'github_owner': '${formData.githubOwner}',
    'github_repo': '${formData.githubRepo}',
    'github_branch': '${formData.githubBranch}',
    'folder': '${formData.folder}'
}

# Use your own instance or the hosted version
response = requests.post('${baseUrl}/api/public-upload', files=files, data=data)
result = response.json()
print(result)

# Or use hosted version directly:
# response = requests.post('https://picser.pages.dev/api/public-upload', files=files, data=data)`;
    };

    const exampleResponse = {
        success: true,
        filename: "image-1703123456789.png",
        url: `https://cdn.jsdelivr.net/gh/${formData.githubOwner}/${formData.githubRepo}@commit_sha/${formData.folder}/image-1703123456789.png`,
        urls: {
            github: `https://github.com/${formData.githubOwner}/${formData.githubRepo}/blob/${formData.githubBranch}/${formData.folder}/image-1703123456789.png`,
            raw: `https://raw.githubusercontent.com/${formData.githubOwner}/${formData.githubRepo}/${formData.githubBranch}/${formData.folder}/image-1703123456789.png`,
            jsdelivr: `https://cdn.jsdelivr.net/gh/${formData.githubOwner}/${formData.githubRepo}@${formData.githubBranch}/${formData.folder}/image-1703123456789.png`,
            github_commit: `https://github.com/${formData.githubOwner}/${formData.githubRepo}/blob/commit_sha/${formData.folder}/image-1703123456789.png`,
            raw_commit: `https://raw.githubusercontent.com/${formData.githubOwner}/${formData.githubRepo}/commit_sha/${formData.folder}/image-1703123456789.png`,
            jsdelivr_commit: `https://cdn.jsdelivr.net/gh/${formData.githubOwner}/${formData.githubRepo}@commit_sha/${formData.folder}/image-1703123456789.png`
        },
        size: 142857,
        type: "image/png",
        commit_sha: "a1b2c3d4e5f6",
        github_url: `https://github.com/${formData.githubOwner}/${formData.githubRepo}/blob/commit_sha/${formData.folder}/image-1703123456789.png`
    };

    const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <span className="text-sm font-medium text-slate-300 capitalize">{language}</span>
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                >
                    {copiedCode === id ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    <span>{copiedCode === id ? 'Copied!' : 'Copy Code'}</span>
                </button>
            </div>
            <div className="relative">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                    }}
                    showLineNumbers={false}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );

    const TabbedCodeExample = () => {
        const [activeTab, setActiveTab] = useState('curl');
        
        const tabs = [
            { id: 'curl', label: 'cURL', language: 'bash', code: generateCurlExample() },
            { id: 'javascript', label: 'JavaScript', language: 'javascript', code: generateJavaScriptExample() },
            { id: 'python', label: 'Python', language: 'python', code: generatePythonExample() },
            { id: 'response', label: 'Response', language: 'json', code: JSON.stringify(exampleResponse, null, 2) }
        ];

        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                                activeTab === tab.id
                                    ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={activeTab === tab.id ? 'block' : 'hidden'}
                        >
                            <CodeBlock code={tab.code} language={tab.language} id={tab.id} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2 text-slate-900 hover:text-blue-600 transition-colors">
                                <Home className="h-5 w-5" />
                                <span className="font-medium">Back to Picser</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://github.com/sh20raj/picser"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6">
                        <Code className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Picser API Documentation
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                        Upload images to GitHub and get instant CDN URLs via jsDelivr. Perfect for developers who need reliable image hosting.
                    </p>

                    {/* Deployment Options */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">🚀 Two Ways to Use Picser</h2>
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div className="bg-white/60 rounded-xl p-4">
                                <h3 className="font-semibold text-blue-700 mb-2">📡 Use Hosted Version</h3>
                                <p className="text-sm text-slate-600 mb-3">
                                    Send requests directly to our hosted API endpoint:
                                </p>
                                <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                                    https://picser.pages.dev/api/public-upload
                                </code>
                                <p className="text-xs text-slate-500 mt-2">
                                    ✅ Your credentials are used only for the upload<br/>
                                    ✅ Nothing is stored on our servers<br/>
                                    ✅ Direct GitHub API communication
                                </p>
                            </div>
                            <div className="bg-white/60 rounded-xl p-4">
                                <h3 className="font-semibold text-green-700 mb-2">🏠 Self-Host for Free</h3>
                                <p className="text-sm text-slate-600 mb-3">
                                    Deploy your own instance on Cloudflare Pages:
                                </p>
                                <div className="space-y-2">
                                    <a 
                                        href="https://github.com/sh20raj/picser" 
                                        target="_blank" 
                                        className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                    >
                                        Fork GitHub Repository →
                                    </a>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    ✅ Complete privacy and control<br/>
                                    ✅ Free Cloudflare Pages hosting<br/>
                                    ✅ Custom domain support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                            <Zap className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">Lightning Fast CDN</h3>
                        </div>
                        <p className="text-slate-600 text-sm">
                            Images are served via jsDelivr CDN with global caching and high performance
                        </p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                            <Shield className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-slate-900">Permanent URLs</h3>
                        </div>
                        <p className="text-slate-600 text-sm">
                            Commit-based URLs ensure your images are permanently accessible
                        </p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                        <div className="flex items-center space-x-3 mb-3">
                            <Globe className="h-5 w-5 text-purple-600" />
                            <h3 className="font-semibold text-slate-900">Global Access</h3>
                        </div>
                        <p className="text-slate-600 text-sm">
                            Access your images from anywhere with multiple URL formats
                        </p>
                    </div>
                </div>

                {/* Configuration Form */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">API Configuration (Playground)</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                GitHub Token
                            </label>
                            <input
                                type="password"
                                value={formData.githubToken}
                                onChange={(e) => setFormData({ ...formData, githubToken: e.target.value })}
                                placeholder="ghp_xxxxxxxxxxxx"
                                className="w-full px-4 py-3 border text-amber-950 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                GitHub Owner
                            </label>
                            <input
                                type="text"
                                value={formData.githubOwner}
                                onChange={(e) => setFormData({ ...formData, githubOwner: e.target.value })}
                                placeholder="sh20raj"
                                className="w-full px-4 py-3 border text-amber-950 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Repository Name
                            </label>
                            <input
                                type="text"
                                value={formData.githubRepo}
                                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                                placeholder="picser"
                                className="w-full px-4 py-3 border text-amber-950 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Branch
                            </label>
                            <input
                                type="text"
                                value={formData.githubBranch}
                                onChange={(e) => setFormData({ ...formData, githubBranch: e.target.value })}
                                placeholder="main"
                                className="w-full px-4 py-3 border text-amber-950 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Upload Folder
                            </label>
                            <input
                                type="text"
                                value={formData.folder}
                                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                                placeholder="uploads"
                                className="w-full px-4 py-3 border text-amber-950 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* API Endpoint */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Endpoint</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">POST</span>
                                <code className="text-blue-900 font-mono text-sm">/api/public-upload</code>
                            </div>
                            <p className="text-xs text-blue-700">Your own instance</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">POST</span>
                                <code className="text-green-900 font-mono text-sm">picser.pages.dev/api/public-upload</code>
                            </div>
                            <p className="text-xs text-green-700">Hosted version (recommended)</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Parameters</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 pr-4 font-medium text-slate-900">Parameter</th>
                                    <th className="text-left py-3 pr-4 font-medium text-slate-900">Type</th>
                                    <th className="text-left py-3 pr-4 font-medium text-slate-900">Required</th>
                                    <th className="text-left py-3 font-medium text-slate-900">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">file</td>
                                    <td className="py-3 pr-4 text-slate-600">File</td>
                                    <td className="py-3 pr-4 text-red-600">Yes</td>
                                    <td className="py-3 text-slate-600">Image file to upload (JPG, PNG, GIF, WebP, max 100MB)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">github_token</td>
                                    <td className="py-3 pr-4 text-slate-600">String</td>
                                    <td className="py-3 pr-4 text-red-600">Yes</td>
                                    <td className="py-3 text-slate-600">GitHub personal access token</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">github_owner</td>
                                    <td className="py-3 pr-4 text-slate-600">String</td>
                                    <td className="py-3 pr-4 text-red-600">Yes</td>
                                    <td className="py-3 text-slate-600">GitHub username or organization</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">github_repo</td>
                                    <td className="py-3 pr-4 text-slate-600">String</td>
                                    <td className="py-3 pr-4 text-red-600">Yes</td>
                                    <td className="py-3 text-slate-600">GitHub repository name</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">github_branch</td>
                                    <td className="py-3 pr-4 text-slate-600">String</td>
                                    <td className="py-3 pr-4 text-slate-600">No</td>
                                    <td className="py-3 text-slate-600">Branch name (default: main)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-slate-900 font-mono">folder</td>
                                    <td className="py-3 pr-4 text-slate-600">String</td>
                                    <td className="py-3 pr-4 text-slate-600">No</td>
                                    <td className="py-3 text-slate-600">Upload folder (default: uploads)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Code Examples</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Ready-to-use code snippets in multiple programming languages. Click any tab to view examples and copy the code.
                        </p>
                    </div>

                    <TabbedCodeExample />
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to get started?</h3>
                        <p className="text-slate-600 mb-6">
                            Try uploading an image through our web interface or start using the API directly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/#upload"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Try Web Upload
                            </Link>
                            <a
                                href="https://github.com/sh20raj/picser"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
                            >
                                <Github className="h-4 w-4 mr-2" />
                                View on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>

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
                                <a
                                    href="https://x.com/sh20raj"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    @sh20raj
                                </a>
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
