#!/usr/bin/env python3
"""Convert the complete AI-drawn four-panel comic to one Instagram/X image.
No segmentation or extra dialogue: the model draws the professional finished composition.
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT=Path("comics-input")
OUT=Path("comics-output")
OUT.mkdir(parents=True,exist_ok=True)

def render(comic_id):
    story=json.loads((ROOT/(comic_id+".json")).read_text(encoding="utf-8"))
    if len(story.get("panels",[]))!=4:
        raise ValueError("Exactly four story panels required")
    source=ROOT/(comic_id+"-complete.png")
    image=Image.open(source).convert("RGB")
    # Contain, never crop: cropping could remove dialogue or entire panels.
    framed=Image.new("RGB",(1080,1350),"#171717")
    resized=ImageOps.contain(image,(1068,1338),method=Image.Resampling.LANCZOS)
    framed.paste(resized,((1080-resized.width)//2,(1350-resized.height)//2))
    target=OUT/(comic_id+"-comic.jpg")
    framed.save(target,quality=95,optimize=True,subsampling=0)
    (OUT/(comic_id+"-caption.txt")).write_text(story.get("caption","")+"\n",encoding="utf-8")
    print("Complete 4-panel comic:",target)

if __name__=="__main__":
    render(sys.argv[1])
