import  sys

from pytube import YouTube


def download_video(url: str, download_path: str, requested_quality: str):
    yt = YouTube(url)
    download_stream = yt.streams.get_by_resolution(requested_quality)
    print(f"Found video: {yt.title} in {requested_quality} quality...")
    if download_stream:
        print('Starting download...')
        filename = yt.title.replace(" ", "_") + "_" + requested_quality + ".mp4"
        download_stream.download(output_path=download_path, filename=filename)
        print(f"Video downloaded at: {download_path}")
    else:
        available_streams = yt.streams.filter(progressive=True).order_by('resolution').desc()
        if available_streams:
            print(f"Requested quality {requested_quality} not available. Available qualities are:")
            for stream in available_streams:
                print(stream.resolution)
        else:
            print("Error fetching available streams.")
        print("Download failed.")


if __name__ == "__main__":
    url = sys.argv[1]
    pos = url.find("?")
    if pos != -1:
        url = url[0:pos]
    download_path = sys.argv[2]
    requested_quality = sys.argv[
        3]  # this can be 720p, 1080p, 1440p, 2160p... and needs a select box to be rendered in the UI, put in the metadata.json file
    download_video(url, download_path, requested_quality)
    print('Done!')







