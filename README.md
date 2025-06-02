# Picser - GitHub Image Upload & Hosting

A modern Next.js 15 application for uploading images to GitHub repositories and getting multiple shareable URLs. Supports both personal use and public API access.

## Features

- 🖼️ **Drag & Drop Upload**: Easy image upload with drag and drop interface
- 📸 **Image Preview**: See your image before and after upload
- 🔗 **Multiple URL Types**: Get 6 different URL formats for each upload:
  - GitHub blob URLs (branch-based & commit-based)
  - Raw GitHub URLs (branch-based & commit-based)  
  - JSDelivr CDN URLs (branch-based & commit-based)
- 🌐 **Public API**: Allow external users to upload to their own repositories
- 📋 **Copy URLs**: One-click copy of image URLs to clipboard
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 📝 **Upload History**: Keep track of all your uploaded images
- 🧪 **Configuration Testing**: Test GitHub setup before uploading
- ⚡ **Edge Runtime**: Fast performance with Cloudflare Pages support
- 📚 **API Documentation**: Complete API docs with interactive examples

## API Endpoints

### 1. Personal Upload API
- **Endpoint**: `POST /api/upload`
- **Purpose**: Upload images using your configured GitHub repository
- **Authentication**: Uses environment variables

### 2. Public Upload API  
- **Endpoint**: `POST /api/public-upload`
- **Purpose**: Allow external users to upload to their own repositories
- **Authentication**: Requires GitHub token in request

### 3. Configuration Test API
- **Endpoint**: `POST /api/test-config`
- **Purpose**: Test GitHub configuration before uploading
- **Returns**: Repository info, branch status, and permissions

## Supported File Types

- JPG/JPEG
- PNG
- GIF
- WebP
- Maximum file size: 10MB

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file with your GitHub configuration:

```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main
```

## GitHub Token Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Create a new **Fine-grained personal access token** or **Classic token**
3. For fine-grained tokens, select your repository and grant these permissions:
   - **Contents**: Write (to upload files)
   - **Metadata**: Read (to access repository info)
4. For classic tokens, select these scopes:
   - `repo` (Full control of private repositories)
5. Copy the token to your `.env.local` file

## Usage

### Personal Use
1. Configure your `.env.local` with your GitHub repository details
2. Visit `http://localhost:3000` 
3. Drag and drop an image or click to browse
4. Get 6 different URL formats for your uploaded image

### Public API Use  
1. Visit `http://localhost:3000/api-docs` for complete API documentation
2. Test your GitHub configuration at `/api/test-config`
3. Use `/api/public-upload` to upload images to any GitHub repository

### URL Types Explained

**Branch-based URLs** (may change if files are updated):
- `github`: View file in GitHub web interface
- `raw`: Direct access to raw file content  
- `jsdelivr`: Fast CDN access with global caching

**Commit-based URLs** (permanent, never change):
- `github_commit`: Permanent link to specific commit version
- `raw_commit`: Direct access to specific commit version
- `jsdelivr_commit`: CDN access to specific commit version

## Deployment

### Cloudflare Pages
This application is optimized for Cloudflare Pages with Edge Runtime:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables in Cloudflare Pages settings
5. Deploy automatically on git push

### Vercel
Deploy easily on Vercel:

1. Connect your GitHub repository
2. Add environment variables  
3. Deploy with zero configuration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **GitHub API**: Octokit/rest
- **TypeScript**: Full type safety
- **Storage**: GitHub repository + localStorage for history

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
