import sys
import os
import yt_dlp


def download_video(url: str, download_path: str, requested_quality: str):
    """
    Downloads a YouTube video using the yt-dlp library.
    """
    # Removes the 'p' from '144p', '720p', etc. to get the height
    quality_code = requested_quality.replace('p', '')

    # yt-dlp options:
    # 'format': Selects the best video up to the specified height and the best audio,
    #           then merges them. It's a robust way to get the quality you want.
    # 'outtmpl': Defines the output path and filename format.
    # 'merge_output_format': Ensures the final file is an mp4.
    ydl_opts = {
        'format': f'bestvideo[height<={quality_code}]+bestaudio/best[height<={quality_code}]',
        'outtmpl': os.path.join(download_path, '%(title)s_%(resolution)s.%(ext)s'),
        'merge_output_format': 'mp4',
    }

    try:
        print(f"Attempting to download video from {url} in {requested_quality}...")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print(f"Video downloaded successfully to: {download_path}")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Download failed.")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python YT_downloader.py <youtube_url> <download_path> <quality>")
        print("Example: python YT_downloader.py https://youtu.be/dQw4w9WgXcQ C:\\Downloads 720p")
        sys.exit(1)

    url = sys.argv[1]
    download_path = sys.argv[2]
    requested_quality = sys.argv[3]

    download_video(url, download_path, requested_quality)
    print('Done!')