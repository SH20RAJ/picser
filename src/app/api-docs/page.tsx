'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Upload, Code, ExternalLink, Github, Home } from 'lucide-react';

export default function APIDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    githubToken: '',
    githubOwner: '',
    githubRepo: '',
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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com';
    return `curl -X POST \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@/path/to/your/image.png" \\
  -F "github_token=${formData.githubToken || 'ghp_xxxxxxxxxxxx'}" \\
  -F "github_owner=${formData.githubOwner || 'yourusername'}" \\
  -F "github_repo=${formData.githubRepo || 'yourrepo'}" \\
  -F "github_branch=${formData.githubBranch}" \\
  -F "folder=${formData.folder}" \\
  ${baseUrl}/api/public-upload`;
  };

  const generateJavaScriptExample = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com';
    return `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('github_token', '${formData.githubToken || 'ghp_xxxxxxxxxxxx'}');
formData.append('github_owner', '${formData.githubOwner || 'yourusername'}');
formData.append('github_repo', '${formData.githubRepo || 'yourrepo'}');
formData.append('github_branch', '${formData.githubBranch}');
formData.append('folder', '${formData.folder}');

const response = await fetch('${baseUrl}/api/public-upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);`;
  };

  const urlExamples = {
    github: `https://github.com/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}/blob/${formData.githubBranch}/public/logo.png`,
    raw: `https://raw.githubusercontent.com/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}/${formData.githubBranch}/public/logo.png`,
    jsdelivr: `https://cdn.jsdelivr.net/gh/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}@${formData.githubBranch}/public/logo.png`,
    github_commit: `https://github.com/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}/blob/2e419d29c7ed798537b74cb82483945b04458fdc/public/logo.png`,
    raw_commit: `https://raw.githubusercontent.com/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}/2e419d29c7ed798537b74cb82483945b04458fdc/public/logo.png`,
    jsdelivr_commit: `https://cdn.jsdelivr.net/gh/${formData.githubOwner || 'SH20RAJ'}/${formData.githubRepo || 'unistory'}@2e419d29c7ed798537b74cb82483945b04458fdc/public/logo.png`
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-xs">{copiedCode === id ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                href="/"
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Picser API</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload images to any GitHub repository and get multiple URL formats instantly. 
            Free, fast, and reliable image hosting via GitHub.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <Upload className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">Upload images to any GitHub repository with a simple API call</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <ExternalLink className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Multiple URLs</h3>
            <p className="text-gray-600 text-sm">Get 6 different URL formats including CDN and permanent commit-based URLs</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <Github className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">GitHub Powered</h3>
            <p className="text-gray-600 text-sm">Leverage GitHub&apos;s infrastructure for reliable and fast image hosting</p>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration</h2>
          <p className="text-gray-600 mb-6">Enter your GitHub repository details to generate customized examples:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Owner/Username</label>
              <input
                type="text"
                value={formData.githubOwner}
                onChange={(e) => setFormData({ ...formData, githubOwner: e.target.value })}
                placeholder="yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repository Name</label>
              <input
                type="text"
                value={formData.githubRepo}
                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                placeholder="yourrepo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={formData.githubBranch}
                onChange={(e) => setFormData({ ...formData, githubBranch: e.target.value })}
                placeholder="main"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Folder</label>
              <input
                type="text"
                value={formData.folder}
                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                placeholder="uploads"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Token (for examples)</label>
            <input
              type="password"
              value={formData.githubToken}
              onChange={(e) => setFormData({ ...formData, githubToken: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is only used to generate examples. Get your token from{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                GitHub Settings
              </a>
            </p>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Test Your Configuration</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Before uploading files, you can test your GitHub configuration to ensure everything is set up correctly.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Test Endpoint</h3>
            <p className="text-sm text-blue-800 mb-2">
              <code className="bg-blue-100 px-2 py-1 rounded text-sm">POST /api/test-config</code>
            </p>
            <p className="text-sm text-blue-700">
              This endpoint validates your GitHub token, repository access, and branch permissions without uploading any files.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Test Request (JavaScript)</h4>
              <CodeBlock
                language="javascript"
                code={`const testConfig = async () => {
  const response = await fetch('/api/test-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      github_token: '${formData.githubToken || 'ghp_xxxxxxxxxxxx'}',
      github_owner: '${formData.githubOwner || 'yourusername'}',
      github_repo: '${formData.githubRepo || 'yourrepo'}',
      github_branch: '${formData.githubBranch || 'main'}'
    })
  });
  
  const result = await response.json();
  console.log(result);
};

testConfig();`}
                id="test-js"
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Test Request (cURL)</h4>
              <CodeBlock
                language="bash"
                code={`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "github_token": "${formData.githubToken || 'ghp_xxxxxxxxxxxx'}",
    "github_owner": "${formData.githubOwner || 'yourusername'}",
    "github_repo": "${formData.githubRepo || 'yourrepo'}",
    "github_branch": "${formData.githubBranch || 'main'}"
  }' \\
  ${typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com'}/api/test-config`}
                id="test-curl"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Expected Response</h4>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "success": true,
  "message": "GitHub configuration is valid",
  "repository": {
    "name": "yourrepo",
    "full_name": "yourusername/yourrepo",
    "private": false,
    "default_branch": "main",
    "permissions": {
      "push": true,
      "pull": true
    }
  },
  "branch": {
    "name": "main",
    "exists": true,
    "note": "Branch exists and is accessible"
  }
}`}
            </pre>
          </div>
        </div>

        {/* URL Types */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">URL Types Explained</h2>
          
          <div className="space-y-6">
            {/* Branch-based URLs */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Branch-based URLs (Dynamic)</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">GitHub URL</h4>
                  <p className="text-sm text-gray-600 mb-1">View the file in GitHub&apos;s web interface</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.github}</code>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Raw URL</h4>
                  <p className="text-sm text-gray-600 mb-1">Direct access to the raw file content</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.raw}</code>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">JSDelivr CDN URL</h4>
                  <p className="text-sm text-gray-600 mb-1">Fast CDN access with global caching</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.jsdelivr}</code>
                </div>
              </div>
            </div>

            {/* Commit-based URLs */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-medium text-green-700 mb-3">Commit-based URLs (Permanent)</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">GitHub URL (Commit)</h4>
                  <p className="text-sm text-gray-600 mb-1">Permanent link to specific commit version</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.github_commit}</code>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Raw URL (Commit)</h4>
                  <p className="text-sm text-gray-600 mb-1">Direct access to specific commit version</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.raw_commit}</code>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">JSDelivr CDN URL (Commit)</h4>
                  <p className="text-sm text-gray-600 mb-1">CDN access to specific commit version</p>
                  <code className="block bg-gray-100 p-2 rounded text-sm break-all">{urlExamples.jsdelivr_commit}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoint */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Endpoint</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium mr-3">POST</span>
              <code className="text-blue-800 font-mono">/api/public-upload</code>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-3">Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parameter</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Required</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">file</td>
                  <td className="px-4 py-2 text-sm">File</td>
                  <td className="px-4 py-2 text-sm">✅ Yes</td>
                  <td className="px-4 py-2 text-sm">Image file (JPG, PNG, GIF, WebP, max 10MB)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">github_token</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">✅ Yes</td>
                  <td className="px-4 py-2 text-sm">GitHub Personal Access Token</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">github_owner</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">✅ Yes</td>
                  <td className="px-4 py-2 text-sm">GitHub username or organization</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">github_repo</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">✅ Yes</td>
                  <td className="px-4 py-2 text-sm">Repository name</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">github_branch</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">❌ No</td>
                  <td className="px-4 py-2 text-sm">Target branch (default: main)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">folder</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">❌ No</td>
                  <td className="px-4 py-2 text-sm">Upload folder (default: uploads)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">cURL Example</h2>
            <CodeBlock code={generateCurlExample()} language="bash" id="curl" />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">JavaScript Example</h2>
            <CodeBlock code={generateJavaScriptExample()} language="javascript" id="js" />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Example</h2>
            <CodeBlock 
              code={JSON.stringify({
                "success": true,
                "message": "Image uploaded successfully",
                "data": {
                  "filename": "uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                  "size": 245760,
                  "type": "image/png",
                  "commit_sha": "2e419d29c7ed798537b74cb82483945b04458fdc",
                  "github_url": "https://github.com/yourusername/yourrepo/blob/main/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                  "urls": {
                    "github": "https://github.com/yourusername/yourrepo/blob/main/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                    "raw": "https://raw.githubusercontent.com/yourusername/yourrepo/main/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                    "jsdelivr": "https://cdn.jsdelivr.net/gh/yourusername/yourrepo@main/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                    "github_commit": "https://github.com/yourusername/yourrepo/blob/2e419d29c7ed798537b74cb82483945b04458fdc/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                    "raw_commit": "https://raw.githubusercontent.com/yourusername/yourrepo/2e419d29c7ed798537b74cb82483945b04458fdc/uploads/2025-06-02T10-30-45-123Z-abc123def.png",
                    "jsdelivr_commit": "https://cdn.jsdelivr.net/gh/yourusername/yourrepo@2e419d29c7ed798537b74cb82483945b04458fdc/uploads/2025-06-02T10-30-45-123Z-abc123def.png"
                  },
                  "repository": {
                    "owner": "yourusername",
                    "repo": "yourrepo",
                    "branch": "main",
                    "folder": "uploads"
                  }
                }
              }, null, 2)} 
              language="json" 
              id="response" 
            />
          </div>
        </div>

                {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Built with ❤️ using Next.js 15 • Open source and free to use
          </p>
        </div>
      </div>
    </div>
  );
}
