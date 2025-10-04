import os
import sys
from PIL import Image, ImageOps

# Set console encoding for Windows compatibility
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except:
        pass

def resize_image(input_path, output_path, target_width, target_height=None, quality=95):
    """Resize a single image maintaining its aspect ratio."""
    try:
        with Image.open(input_path) as img:
            # Handle EXIF orientation properly using ImageOps
            img = ImageOps.exif_transpose(img)
            
            # Get original dimensions after orientation correction
            original_width, original_height = img.size
            
            # Calculate new dimensions maintaining aspect ratio
            if target_height is None:
                # Only width specified - calculate height maintaining aspect ratio
                aspect_ratio = original_height / original_width
                new_width = target_width
                new_height = int(target_width * aspect_ratio)
            else:
                # Both width and height specified - fit within bounds maintaining aspect ratio
                width_ratio = target_width / original_width
                height_ratio = target_height / original_height
                
                # Use the smaller ratio to fit within bounds without stretching
                ratio = min(width_ratio, height_ratio)
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
            
            # Convert to RGB if necessary (for JPEG output)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize the image
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save the resized image
            resized_img.save(output_path, optimize=True, quality=quality)
            return True, (original_width, original_height), (new_width, new_height)
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")
        return False, None, None

def batch_resize_images(folder_path, width, height=None, save_option="overwrite", quality=95):
    """
    Batch resize all images in a folder.
    
    Args:
        folder_path (str): Path to the folder containing images
        width (int): Target width for resized images
        height (int): Target height for resized images (optional, maintains aspect ratio if not provided)
        save_option (str): "overwrite" (replaces originals) or "new_folder" (saves in 'Resized Photos' folder)
        quality (int): JPEG quality (1-100)
    """
    # Supported image formats
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')
    
    # Check if input folder exists
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return False
    
    # Get all image files in the folder
    image_files = [f for f in os.listdir(folder_path) 
                   if f.lower().endswith(supported_formats)]
    
    if not image_files:
        print(f"No supported image files found in '{folder_path}'.")
        print(f"Supported formats: {', '.join(supported_formats)}")
        return False
    
    # Set up output directory based on save_option
    if save_option == "new_folder":
        output_dir = os.path.join(folder_path, "Resized Photos")
        os.makedirs(output_dir, exist_ok=True)
    else:  # overwrite
        output_dir = folder_path
    
    # Display processing information
    if height is None:
        print(f"Resizing images to width: {width}px (maintaining individual aspect ratios)")
    else:
        print(f"Resizing images to fit within: {width}x{height}px (maintaining individual aspect ratios)")
    
    print(f"Processing {len(image_files)} images...")
    print(f"Output location: {output_dir}")
    print("-" * 50)
    
    successful = 0
    failed = 0
    
    # Process each image
    for i, filename in enumerate(image_files, 1):
        input_path = os.path.join(folder_path, filename)
        
        # Generate output filename based on save_option
        name, ext = os.path.splitext(filename)
        if save_option == "new_folder":
            output_filename = filename  # Keep original filename in new folder
        else:  # overwrite
            output_filename = filename  # Overwrite original file
        
        output_path = os.path.join(output_dir, output_filename)
        
        print(f"[{i}/{len(image_files)}] Processing: {filename}")
        
        result, original_dims, new_dims = resize_image(input_path, output_path, width, height, quality)
        if result:
            successful += 1
            if original_dims and new_dims:
                print(f"  [OK] {original_dims[0]}x{original_dims[1]} → {new_dims[0]}x{new_dims[1]} - Saved as: {output_filename}")
            else:
                print(f"  [OK] Saved as: {output_filename}")
        else:
            failed += 1
            print(f"  [ERROR] Failed to process: {filename}")
    
    print("-" * 50)
    print(f"Batch resize completed!")
    print(f"Successfully processed: {successful} images")
    if failed > 0:
        print(f"Failed: {failed} images")
    
    return successful > 0

def main():
    # Simple argument handling for app execution
    if len(sys.argv) < 3:
        print("Usage: python batch_resizer.py <folder_path> <width> [height] [save_option] [quality]")
        sys.exit(1)
    
    try:
        folder_path = sys.argv[1]
        width = int(sys.argv[2])
        
        # Handle height - check for empty string, None, or invalid values
        height = None
        if len(sys.argv) > 3 and sys.argv[3] and sys.argv[3].strip() and sys.argv[3].isdigit():
            height = int(sys.argv[3])
        
        # Handle save_option - check for empty string and provide proper default
        save_option = "new_folder"  # Default value
        if len(sys.argv) > 4 and sys.argv[4] and sys.argv[4].strip():
            save_option = sys.argv[4].strip()
            # Validate save_option value
            if save_option not in ["new_folder", "overwrite"]:
                save_option = "new_folder"
        
        # Handle quality - check for empty string and provide proper default
        quality = 95  # Default value
        if len(sys.argv) > 5 and sys.argv[5] and sys.argv[5].strip() and sys.argv[5].isdigit():
            quality = int(sys.argv[5])
            # Validate quality range
            if quality < 1 or quality > 100:
                quality = 95
        
    except (IndexError, ValueError) as e:
        print(f"Error parsing arguments: {e}")
        print("Usage: batch_resizer.exe <folder_path> <width> [height] [save_option] [quality]")
        sys.exit(1)
    

    
    # Validate arguments
    if width <= 0:
        print("Error: Width must be a positive integer.")
        sys.exit(1)
    
    if height is not None and height <= 0:
        print("Error: Height must be a positive integer.")
        sys.exit(1)
    
    # Run batch resize
    success = batch_resize_images(
        folder_path=folder_path,
        width=width,
        height=height,
        save_option=save_option,
        quality=quality
    )
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()