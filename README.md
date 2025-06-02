# Picser - GitHub Image Upload

A modern Next.js 15 application for uploading images to GitHub repositories and getting shareable URLs.

## Features

- 🖼️ **Drag & Drop Upload**: Easy image upload with drag and drop interface
- 📸 **Image Preview**: See your image before and after upload
- 🔗 **GitHub Integration**: Images are stored directly in your GitHub repository
- 📋 **Copy URLs**: One-click copy of image URLs to clipboard
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 📝 **Upload History**: Keep track of all your uploaded images
- ⚡ **Fast**: Built with Next.js 15 and Turbopack

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

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Create a new token with `Contents` and `Metadata` permissions
3. Copy the token to your `.env.local` file

## How It Works

1. **Upload**: Drag and drop an image or click to browse
2. **Preview**: See a preview of your image while it uploads
3. **Storage**: Image is uploaded to your GitHub repository
4. **URL**: Get a direct URL to access your image
5. **History**: All uploads are saved locally for easy access

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
