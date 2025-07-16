from ntpath import isdir
import os
from shlex import join
import shutil
import sys

def organize(folder_path : str):
    """
    The function organizes the files in a folder by moving them to subfolders based on their extension.
    :param folder_path: The path to the folder containing the files to be organized.
    :return: None
    """
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        print("Folder does not exist")
        return
    files = os.listdir(folder_path)
    photos = []
    videos = []
    documents = []
    music = []
    productivity = []
    source_code = []
    archives = []
    executables = []
    precompiled = []
    others = []
    for file in files:
        if os.path.isdir(file):
            continue
        extension = os.path.splitext(file)[1]
        if extension == "":
            continue

        if extension in [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".raw", ".heif", ".indd", ".svg", 
        ".ai", ".eps", ".CR2", ".CR3", ".dng", ".ARW", ".NEF", ".RAF", ".RW2", ".orf"]:
            photos.append(file)
        elif extension in [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".vob", ".ogv", ".drc", ".gifv", ".mng", ".qt", ".rm", ".rmvb",
        ".asf", ".amv", ".mpg", ".mpeg", ".m2v", ".m4v", ".svi", ".3gp", ".3g2", ".mxf", ".roq", ".nsv", ".f4v", ".f4p", ".f4a", ".f4b", ".H264"]:
            videos.append(file)
        elif extension in [".doc", ".docx", ".odt", ".rtf", ".tex", ".txt", ".pdf", ".epub", ".xps", ".oxps", ".cbz", ".cbr", ".cb7", ".cbt", ".cba", 
        ".cbz", ".cb7", ".cbt", ".cba", ".ppt", ".exc", ".xlsx", ".pptx", ".xlsm", ".xlsb", ".html", ".csv", ".json"]:
            documents.append(file)
        elif extension in [".mp3", ".wav", ".aac", ".flac", ".m4a", ".ogg", ".wma", ".aiff", ".ape", ".dsf", ".wv", ".amr", ".mid", ".midi", ".rmi"]:
            music.append(file)
        elif extension in [".odp", ".pps", ".odg", ".otp", ".pot", ".potx", ".potm", ".ppam", ".ppsx", ".ppsm", ".sldx", ".sldm", ".PST", ".POTX",
        ".POTM", ".PPAM", ".PPSX", ".PPSM", ".SLDX", ".SLDM", ".drp", ".PRPROJ"]:
            productivity.append(file)
        elif extension in [".py", ".java", ".c", ".cpp", ".h", ".hpp", ".cs", ".js", ".ts", ".php", ".rb", ".go", ".swift", ".kt", ".scala", ".groovy", 
        ".tsx", ".jsx", ".css", ".SQLite"]:
            source_code.append(file)
        elif extension in [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".lz", ".lzma", ".lzo", ".z", ".Z", ".a", ".ar", ".cpio", ".iso", ".msi",
        ".msp", ".pkg", ".dmg", ".vcd", ".cram", ".bzip2"]:
            archives.append(file)
        elif extension in [".exe", ".msi", ".bat", ".cmd", ".com", ".vbs", ".vbe", ".js", ".jse", ".wsf", ".wsh", ".ps1", ".ps1xml", ".ps2", ".ps2xml", ".sh"]:
            executables.append(file)
        elif extension in [".o", ".obj", ".lib", ".a", ".so", ".dll", ".dylib", ".a", ".lib", ".dll", ".so", ".dylib", ".a", ".lib", ".dll", ".so", ".dylib"]:
            precompiled.append(file)
        else:
            others.append(file)

    no_empty = 0
    if len(photos) == 0:
        no_empty += 1
    if len(videos) == 0:
        no_empty += 1
    if len(documents) == 0:
        no_empty += 1
    if len(music) == 0:
        no_empty += 1
    if len(productivity) == 0:
        no_empty += 1
    if len(source_code) == 0:
        no_empty += 1
    if len(archives) == 0:
        no_empty += 1
    if len(executables) == 0:
        no_empty += 1
    if len(precompiled) == 0:
        no_empty += 1
    if len(others) == 0:
        no_empty += 1

    if no_empty == 10:
        print("No files to organize")
        return
    if no_empty == 9:
        print("Files are already of one type")
        return
    os.makedirs(os.path.join(folder_path, "Photos"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Videos"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Documents"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Music"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Productivity"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Source Code"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Archives"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Executables"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Precompiled"), exist_ok=True)
    os.makedirs(os.path.join(folder_path, "Others"), exist_ok=True)

    for photo in photos:
        shutil.move(os.path.join(folder_path, photo), os.path.join(folder_path, "Photos", photo))
    for video in videos:
        shutil.move(os.path.join(folder_path, video), os.path.join(folder_path, "Videos", video))
    for document in documents:
        shutil.move(os.path.join(folder_path, document), os.path.join(folder_path, "Documents", document))
    for music in music:
        shutil.move(os.path.join(folder_path, music), os.path.join(folder_path, "Music", music))
    for productivity in productivity:
        shutil.move(os.path.join(folder_path, productivity), os.path.join(folder_path, "Productivity", productivity))
    for source_code in source_code:
        shutil.move(os.path.join(folder_path, source_code), os.path.join(folder_path, "Source Code", source_code))
    for archives in archives:
        shutil.move(os.path.join(folder_path, archives), os.path.join(folder_path, "Archives", archives))
    for executables in executables:
        shutil.move(os.path.join(folder_path, executables), os.path.join(folder_path, "Executables", executables))
    for precompiled in precompiled:
        shutil.move(os.path.join(folder_path, precompiled), os.path.join(folder_path, "Precompiled", precompiled))
    for others in others:
        shutil.move(os.path.join(folder_path, others), os.path.join(folder_path, "Others", others))
    print("Done")
    return

def run():
    """
    The function runs the organize function with a folder path.
    :return: None
    """
    folder_path = sys.argv[1]
    organize(folder_path)
    return

if __name__ == "__main__":
    run()