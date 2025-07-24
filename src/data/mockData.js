export const officialMockScripts = [
    {
        id: 'file-organizer',
        name: 'File Organizer',
        title: 'File Organizer',
        description: 'Organizes files in a folder by extension.',
        longDescription: 'This script will organize the files in a directory/folder into subfolders based on extension/type of file (e.g. images, documents, videos, music, etc.)',
        category: 'file-management',
        isNew: true,
        type: 'official',
        parameters: [
            {
                name: 'folder-path',
                label: 'Folder to organize:',
                type: 'file',
                placeholder: 'C:\\Users\\YourName\\Downloads',
                required: true
            }
        ]
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        title: 'Image Compressor',
        description: 'Compresses JPG and PNG images.',
        category: 'media',
        isNew: false,
        type: 'official',
        parameters: [
            {
                name: 'image-folder',
                label: 'Image folder:',
                type: 'file',
                placeholder: 'C:\\Users\\YourName\\Pictures',
                required: true
            },
            {
                name: 'quality',
                label: 'Compression quality:',
                type: 'select',
                options: [
                    { value: 'high', label: 'High Quality' },
                    { value: 'medium', label: 'Medium Quality' },
                    { value: 'low', label: 'Low Quality' }
                ],
                required: true
            }
        ]
    },
    {
        id: 'video-to-mp3',
        name: 'Video to MP3',
        title: 'Video to MP3',
        description: 'Converts video files to MP3 audio.',
        longDescription: 'Select a video file and extract the audio as an MP3. Supports MP4, AVI, MOV, and more.',
        category: 'media',
        isNew: false,
        type: 'official',
        parameters: [
            {
                name: 'video-file',
                label: 'Video file:',
                type: 'file',
                placeholder: 'Select a video file',
                required: true
            }
        ]
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        title: 'Image Resizer',
        description: 'Resize images to custom dimensions.',
        longDescription: 'Resize one or more images to a specific width and height. Supports JPG, PNG, and BMP.',
        category: 'media',
        isNew: false,
        type: 'official',
        parameters: [
            {
                name: 'image-files',
                label: 'Images to resize:',
                type: 'file',
                placeholder: 'Select images',
                required: true
            },
            {
                name: 'width',
                label: 'Width (px):',
                type: 'text',
                placeholder: 'e.g. 800',
                required: true
            },
            {
                name: 'height',
                label: 'Height (px):',
                type: 'text',
                placeholder: 'e.g. 600',
                required: true
            }
        ]
    },
    {
        id: 'prefix-files',
        name: 'Prefix Files',
        title: 'Prefix Files',
        description: 'Adds a prefix to all files in a folder.',
        longDescription: 'Batch rename files in a folder by adding a prefix to each filename.',
        category: 'file-management',
        isNew: false,
        type: 'official',
        parameters: [
            {
                name: 'target-folder',
                label: 'Target folder:',
                type: 'file',
                placeholder: 'C:\\Users\\YourName\\Documents',
                required: true
            },
            {
                name: 'prefix',
                label: 'Prefix:',
                type: 'text',
                placeholder: 'e.g. Project_',
                required: true
            }
        ]
    }
];

export const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'file-management', label: 'File Management' },
    { value: 'media', label: 'Media' },
    { value: 'backup', label: 'Backup' },
    { value: 'automation', label: 'Automation' },
    { value: 'development', label: 'Development' }
];

// My scripts array
export const myMockScripts = [
    {
        id: 'my-backup',
        name: 'My Custom Backup',
        title: 'My Custom Backup',
        description: 'Backs up my project folder to an external drive.',
        longDescription: 'A personal backup script to copy important files to an external drive. Supports scheduling.',
        category: 'backup',
        isNew: false,
        type: 'my',
        parameters: [
            {
                name: 'source-folder',
                label: 'Source folder:',
                type: 'file',
                placeholder: 'C:\\Users\\YourName\\Projects',
                required: true
            },
            {
                name: 'destination-folder',
                label: 'Destination folder:',
                type: 'file',
                placeholder: 'E:\\Backups',
                required: true
            },
            {
                name: 'schedule',
                label: 'Backup schedule:',
                type: 'select',
                options: [
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'manual', label: 'Manual' }
                ],
                required: true
            }
        ]
    }
];

// Community scripts array
export const communityMockScripts = [
    {
        id: 'pdf-merger',
        name: 'PDF Merger',
        title: 'PDF Merger',
        description: 'Combines multiple PDF files into a single document with custom ordering.',
        longDescription: 'Merge several PDF files into one. You can specify the order and remove unwanted pages.',
        category: 'file-management',
        isNew: false,
        type: 'community',
        author: 'Jane Doe',
        downloadCount: 120,
        rating: 4.7,
        parameters: [
            {
                name: 'pdf-files',
                label: 'PDF files to merge:',
                type: 'file',
                placeholder: 'Select PDF files',
                required: true
            }
        ]
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        title: 'QR Code Generator',
        description: 'Generates QR codes from text or URLs with customizable size and format.',
        longDescription: 'Create QR codes for links, text, or contact info. Choose size and output format (PNG, SVG).',
        category: 'automation',
        isNew: true,
        type: 'community',
        author: 'John Smith',
        downloadCount: 300,
        rating: 4.9,
        parameters: [
            {
                name: 'input-text',
                label: 'Text or URL:',
                type: 'text',
                placeholder: 'https://example.com',
                required: true
            },
            {
                name: 'size',
                label: 'QR code size:',
                type: 'select',
                options: [
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                ],
                required: true
            },
            {
                name: 'format',
                label: 'Output format:',
                type: 'select',
                options: [
                    { value: 'png', label: 'PNG' },
                    { value: 'svg', label: 'SVG' }
                ],
                required: true
            }
        ]
    },
    {
        id: 'youtube-downloader',
        name: 'YouTube Downloader',
        title: 'YouTube Downloader',
        description: 'Downloads YouTube videos in various formats and quality settings.',
        longDescription: 'Paste a YouTube link and choose the format and quality. Supports MP4, MP3, and more.',
        category: 'media',
        isNew: false,
        type: 'community',
        author: 'VideoFan',
        downloadCount: 500,
        rating: 4.5,
        parameters: [
            {
                name: 'youtube-url',
                label: 'YouTube URL:',
                type: 'text',
                placeholder: 'https://youtube.com/watch?v=...',
                required: true
            },
            {
                name: 'format',
                label: 'Download format:',
                type: 'select',
                options: [
                    { value: 'mp4', label: 'MP4 (video)' },
                    { value: 'mp3', label: 'MP3 (audio)' }
                ],
                required: true
            },
            {
                name: 'quality',
                label: 'Quality:',
                type: 'select',
                options: [
                    { value: '1080p', label: '1080p' },
                    { value: '720p', label: '720p' },
                    { value: '480p', label: '480p' },
                    { value: 'audio', label: 'Audio only' }
                ],
                required: true
            }
        ]
    }
];

export let rootFolder = 'C:\\Users\\YourName\\Documents\\ScriptHub'; // Default root folder for file inputs
