# Image Optimization Script for Bina Health Care
# This script will:
# - Convert all JPG/PNG images in the specified folders to WebP (smaller, faster)
# - Resize images to a max width/height (default: 1200px for full, 400px for thumbs)
# - Create thumbnails for gallery use
#
# Requirements: Python 3.x, Pillow, and webptools (pip install pillow webptools)

import os
from PIL import Image
from webptools import dwebp, cwebp

# Settings
IMAGE_DIRS = [
    './public/pictures/heroImages',
    './public/pictures/galleryImages',
    './public/pictures/teamImages',
]
THUMB_SIZE = (400, 400)
FULL_SIZE = (1200, 1200)
THUMB_SUFFIX = '_thumb.webp'
FULL_SUFFIX = '.webp'


def optimize_image(src_path, dest_path, size, quality=80):
    with Image.open(src_path) as img:
        img.thumbnail(size, Image.LANCZOS)
        img.save(dest_path, 'WEBP', quality=quality, method=6)


def process_folder(folder):
    for fname in os.listdir(folder):
        if not fname.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        src = os.path.join(folder, fname)
        base, _ = os.path.splitext(fname)
        # Full-size optimized
        full_dest = os.path.join(folder, base + FULL_SUFFIX)
        optimize_image(src, full_dest, FULL_SIZE)
        # Thumbnail
        thumb_dest = os.path.join(folder, base + THUMB_SUFFIX)
        optimize_image(src, thumb_dest, THUMB_SIZE)
        print(f'Optimized: {fname}')


def main():
    for folder in IMAGE_DIRS:
        if os.path.exists(folder):
            process_folder(folder)
        else:
            print(f'Skipped missing folder: {folder}')

if __name__ == '__main__':
    main()
