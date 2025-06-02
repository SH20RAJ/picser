import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export const runtime = "edge";


const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 100MB' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Content = buffer.toString('base64');

        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `uploads/${timestamp}-${Math.random().toString(36).substr(2, 9)}.${extension}`;

        // Upload to GitHub
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER!,
            repo: process.env.GITHUB_REPO!,
            path: filename,
            message: `Upload image: ${file.name}`,
            content: base64Content,
            branch: process.env.GITHUB_BRANCH || 'main',
        });

        const owner = process.env.GITHUB_OWNER!;
        const repo = process.env.GITHUB_REPO!;
        const branch = process.env.GITHUB_BRANCH || 'main';
        const commitSha = response.data.commit.sha;

        // Generate all URL types
        const urls = {
            // Branch-based URLs
            github: `https://github.com/${owner}/${repo}/blob/${branch}/${filename}`,
            raw: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`,
            jsdelivr: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filename}`,

            // Commit-based URLs (permanent)
            github_commit: `https://github.com/${owner}/${repo}/blob/${commitSha}/${filename}`,
            raw_commit: `https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/${filename}`,
            jsdelivr_commit: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${commitSha}/${filename}`,
        };

        return NextResponse.json({
            success: true,
            url: urls.raw, // Default URL for backward compatibility
            urls: urls,
            filename: filename,
            size: file.size,
            type: file.type,
            commit_sha: commitSha,
            github_url: response.data.content?.html_url,
        });

    } catch (error) {
        console.error('Upload error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: `Upload failed: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Upload failed: Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Image upload API endpoint',
        methods: ['POST'],
        maxFileSize: '100MB',
        allowedTypes: ['image/*'],
    });
}
