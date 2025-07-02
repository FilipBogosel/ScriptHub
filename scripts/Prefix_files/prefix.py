from itertools import count
from ntpath import isdir
import os
import sys
import time
import random
import datetime

def prefixer(folder_path : str, prefix : str):
    """
    The function prefixes all the files in a folder with a given prefix. It skippes any subdirectories.
    :param folder_path: The path to the folder containing the files to be prefixed.
    :param prefix: The prefix to be added to the beginning of each file name.
    :return: None
    """
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        print("Folder does not exist")
        return
    files = os.listdir(folder_path)
    files.sort(key = lambda file : os.path.getmtime(os.path.join(folder_path, file)))
    count = 1
    for file in files:
        if os.path.isdir(file):
            continue
        name, extension = os.path.splitext(file)
        old_path = os.path.join(folder_path,file)
        new_name = f"{prefix} {count}{extension}"
        new_path = os.path.join(folder_path, new_name)
        os.rename(old_path, new_path)
        count += 1
        print(f"Renamed {file} to {new_name}")
    print("Done")
    return

def run():
    """
    The function runs the prefixer function with a folder path and a prefix.
    :return: None
    """
    folder_path = sys.argv[1]
    prefix = sys.argv[2]
    prefixer(folder_path, prefix)
    return

if __name__ == "__main__":
    run()

