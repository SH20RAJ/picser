import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { github_token, github_owner, github_repo, github_branch = 'main' } = body;

        // Validate required fields
        if (!github_token || !github_owner || !github_repo) {
            return NextResponse.json(
                {
                    error: 'Missing required GitHub configuration',
                    required_fields: ['github_token', 'github_owner', 'github_repo'],
                    optional_fields: ['github_branch']
                },
                { status: 400 }
            );
        }

        // Test GitHub API access
        const response = await fetch(`https://api.github.com/repos/${github_owner}/${github_repo}`, {
            headers: {
                'Authorization': `Bearer ${github_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Picser-API-Test/1.0'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 401) {
                return NextResponse.json(
                    {
                        error: 'Invalid GitHub token',
                        message: 'The provided GitHub token is invalid or expired'
                    },
                    { status: 401 }
                );
            }

            if (response.status === 404) {
                return NextResponse.json(
                    {
                        error: 'Repository not found',
                        message: 'The repository does not exist or you do not have access to it'
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    error: 'GitHub API error',
                    message: errorData.message || 'Unknown error',
                    status: response.status
                },
                { status: response.status }
            );
        }

        const repoData = await response.json();

        // Check if the branch exists
        const branchResponse = await fetch(`https://api.github.com/repos/${github_owner}/${github_repo}/branches/${github_branch}`, {
            headers: {
                'Authorization': `Bearer ${github_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Picser-API-Test/1.0'
            }
        });

        const branchExists = branchResponse.ok;

        return NextResponse.json({
            success: true,
            message: 'GitHub configuration is valid',
            repository: {
                name: repoData.name,
                full_name: repoData.full_name,
                private: repoData.private,
                default_branch: repoData.default_branch,
                permissions: repoData.permissions
            },
            branch: {
                name: github_branch,
                exists: branchExists,
                note: branchExists ? 'Branch exists and is accessible' : 'Branch will be created on first upload'
            },
            rate_limit: {
                note: 'Check your GitHub API rate limits',
                docs_url: 'https://docs.github.com/en/rest/rate-limit'
            }
        });

    } catch (error) {
        console.error('Test API error:', error);

        return NextResponse.json(
            {
                error: 'Test failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/test-config',
        description: 'Test GitHub configuration for the public upload API',
        method: 'POST',
        contentType: 'application/json',
        parameters: {
            github_token: {
                type: 'string',
                required: true,
                description: 'GitHub personal access token with repo permissions'
            },
            github_owner: {
                type: 'string',
                required: true,
                description: 'GitHub username or organization name'
            },
            github_repo: {
                type: 'string',
                required: true,
                description: 'Repository name'
            },
            github_branch: {
                type: 'string',
                required: false,
                default: 'main',
                description: 'Target branch name'
            }
        },
        example: {
            github_token: 'ghp_xxxxxxxxxxxx',
            github_owner: 'yourusername',
            github_repo: 'yourrepo',
            github_branch: 'main'
        }
    });
}
