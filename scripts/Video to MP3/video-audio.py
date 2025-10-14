import os
from moviepy import VideoFileClip
import sys 
import pathlib

def extract_audio(video_path, output_audio_path=None, mp3_name=None):
    """
    Extracts audio from a video file and saves it as an MP3 file.

    Args:
        video_path (str): The full path to the input video file.
    
    Returns:
        bool: True if extraction was successful, False otherwise.
    """
    if not os.path.exists(video_path):
        print(f"Error: The file '{video_path}' was not found.")
        return False

    try:
        # Load the video file
        video_clip = VideoFileClip(video_path)
        
        # Get the audio from the video clip
        audio_clip = video_clip.audio
        
        # Define the output audio file path
        # It replaces the original file extension with .mp3
        file_name, _ = os.path.splitext(video_path)
        if mp3_name is not None and mp3_name != '':
            file_name = mp3_name
        if output_audio_path is not None and output_audio_path != '':
            output_audio_path = os.path.join(output_audio_path, f"{os.path.basename(file_name)}.mp3")
        else:
            output_audio_path = f"{file_name}.mp3"       
        print(f"Extracting audio to '{output_audio_path}'...")
        
        # Write the audio to the new MP3 file
        # The codec='mp3' ensures the output is in MP3 format.
        audio_clip.write_audiofile(output_audio_path, codec='mp3')
        
        # Close the clips to release system resources
        audio_clip.close()
        video_clip.close()
        
        print("\nExtraction successful!")
        return True

    except Exception as e:
        # Catch potential errors during processing
        print(f"\nAn error occurred: {e}")
        # Clean up resources if they were opened
        if 'video_clip' in locals() and video_clip:
            video_clip.close()
        if 'audio_clip' in locals() and audio_clip:
            audio_clip.close()
        return False

#we'll have 3 arguments from the command line: video_path, output_audio_path, and the name of the mp3 file. 
def run():
    video_path = sys.argv[1]
    output_audio_path = sys.argv[2]
    mp3_name = sys.argv[3]
    if output_audio_path == '':
        output_audio_path = None
    if mp3_name == '':
        mp3_name = None
    print(f'Starting audio extraction from {video_path} to {output_audio_path} with name {mp3_name}...')
    extract_audio(video_path, output_audio_path, mp3_name)
    print ('Audio extraction process completed.')
if __name__ == "__main__":
    run()
