from PIL import Image, ImageOps
import os
import sys

def resize_image(image_path, output_path, width, height = None) -> None:
    print('Starting image resize...')
    try:
        image = Image.open(image_path)
        image = ImageOps.exif_transpose(image)  # Handle image orientation based on EXIF data
    except Exception as e:
        print(f"Error opening image: {e}")
        return
    if height is None:
        aspect_ratio = image.width / image.height
        height = int(width / aspect_ratio)
    try:
        #High-quality resize
        resized_image = image.resize((width, height), Image.Resampling.LANCZOS)
    except Exception as e:
        print(f"Error resizing image: {e}")
        return
    try:
        #Save the resized image in the same format as the original
        resized_image.save(output_path, format=image.format, quality = 90, optimize = True) 
        print(f"Image resized and saved to {output_path}")
    except Exception as e:
        print(f"Error saving image: {e}")
    image.close()
    return

def run()-> None:
    path = sys.argv[1]
    save_option = sys.argv[2]
    if(not os.path.isfile(path)):
        print("Invalid file path.")
        return
    if not path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
        print("Unsupported file format. Please provide an image file.")
        print("Supported formats: PNG, JPG, JPEG, BMP, GIF, TIFF")
        print("Exiting...")
        return
    
    if save_option == 'overwrite':
        output_path = path
    else:
        output_path = os.path.splitext(path)[0] + '_resized' + os.path.splitext(path)[1]
    
    try: 
        width = int(sys.argv[3])
    except ValueError:
        print("Width must be an integer.")
        print("Exiting...")
        return
    if sys.argv[4] == '':
        height = None
    else:
        try:
            height = int(sys.argv[4])
        except ValueError:
            print("Height must be an integer.")
            print("Exiting...")
            return
    resize_image(path, output_path, width, height)
    return

if __name__ == "__main__":
    run()

