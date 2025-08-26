import qrcode
import cv2
import os
import sys

def genetate_qr_code(link):
    """
    The function takes a link as an argument and returns a QR code image
    :param link: The link to be encoded in the QR code
    :return: A QR code image
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit = True)
    img = qr.make_image(fill_color = "black", back_color = "white")
    return img

def save_qr_code(path, name, img):
    """
    It takes a path and a name as input, and saves the QR code image to the path with the name
    :param path: The path to the folder where you want to save the QR code
    :param name: The name of the file
    :param img: The image object
    :return: none
    """
    img = genetate_qr_code(link)
    img.save(os.path.join(path,name + ".png"))
    return None


if __name__ == "__main__":
    link = sys.argv[1]
    path = sys.argv[2]
    name = sys.argv[3]
    img = genetate_qr_code(link)
    if not os.path.exists(path):
        print("Path does not exist")
    else:    
        save_qr_code(path, name, img)
        print("QR code saved")