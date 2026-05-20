#!/usr/bin/env python3
"""Generate PWA icons for Koperasi Mini Syariah."""
from PIL import Image, ImageDraw, ImageFont
import os

def generate_icon(size, filepath):
    # Create a new image with a gradient background (green shades)
    img = Image.new('RGBA', (size, size), (34, 139, 34, 255))  # Green background
    draw = ImageDraw.Draw(img)
    
    # Add a lighter circle in the center
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(50, 205, 50, 255))
    
    # Add text "KS" (Koperasi Syariah)
    try:
        # Try to use a font, fallback to default
        font_size = size // 3
        font = ImageFont.truetype("/system/fonts/DroidSans.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text = "KS"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - size // 10)
    
    draw.text(position, text, fill=(255, 255, 255, 255), font=font)
    
    # Add small text "SYARIAH" at bottom
    try:
        small_font = ImageFont.truetype("/system/fonts/DroidSans.ttf", size // 10)
    except:
        small_font = ImageFont.load_default()
    
    small_text = "SYARIAH"
    bbox = draw.textbbox((0, 0), small_text, font=small_font)
    small_width = bbox[2] - bbox[0]
    small_pos = ((size - small_width) // 2, size - size // 6)
    draw.text(small_pos, small_text, fill=(255, 255, 255, 200), font=small_font)
    
    img.save(filepath, 'PNG')
    print(f"✅ Generated: {filepath}")

if __name__ == '__main__':
    base_dir = os.path.join(os.path.expanduser('~'), 'koperasi_mini', 'frontend', 'public')
    generate_icon(192, os.path.join(base_dir, 'icon-192x192.png'))
    generate_icon(512, os.path.join(base_dir, 'icon-512x512.png'))
    print("🎉 All icons generated!")
