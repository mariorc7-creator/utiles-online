#!/usr/bin/env python3
"""Turn AI 2x2 contact sheet into four branded 1080x1350 images and a combined comic."""
from pathlib import Path
import sys,json,textwrap,zipfile
from PIL import Image,ImageDraw,ImageFont,ImageOps
I=Path("comics-input");O=Path("comics-output");O.mkdir(exist_ok=True)
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def font(sz,bold=False):return ImageFont.truetype(B if bold else F,sz)
def wrap(draw,s,f,width):
    result=[];line=""
    for word in s.split():
        candidate=(line+" "+word).strip()
        if line and draw.textbbox((0,0),candidate,font=f)[2]>width:
            result.append(line);line=word
        else:line=candidate
    if line:result.append(line)
    return result
def make(identifier):
    story=json.loads((I/(identifier+".json")).read_text())
    sheets=[]
    for i,panel in enumerate(story["panels"]):
        x=i%2;y=i//2
        margin=12
        crop=sheet.crop((x*w//2+margin,y*h//2+margin,(x+1)*w//2-margin,(y+1)*h//2-margin))
        im=Image.new("RGB",(1080,1350),"#FFFFFF")
        art=ImageOps.fit(crop,(1080,1350),method=Image.Resampling.LANCZOS)
        im.paste(art,(0,0))
        d=ImageDraw.Draw(im)
        title=panel["text"].strip().replace("\\n"," ")
        f=font(54,True)
        lines=wrap(d,title,f,890)
        while len(lines)>3 and f.size>35:
            f=font(f.size-3,True);lines=wrap(d,title,f,890)
        if len(lines)>4:raise ValueError("Text too long")
        lineheight=f.size+14
        h=max(155,len(lines)*lineheight+72)
        d.rounded_rectangle((42,60,1038,60+h),radius=48,fill="white",outline="#151515",width=6)
        ytext=95
        for line in lines:
            d.text((540,ytext),line,font=f,anchor="mt",fill="#151515")
            ytext+=lineheight
        dest=O/(identifier+f"-{i+1:02d}.jpg")
        im.save(dest,quality=91,optimize=True)
        sheets.append(dest)
    # 2x2 preview for editorial review.
    preview=Image.new("RGB",(1080,1350),"#FFFFFF")
    for i,file in enumerate(sheets):
        thumb=Image.open(file).resize((540,675))
        preview.paste(thumb,((i%2)*540,(i//2)*675))
    preview.save(O/(identifier+"-preview.jpg"),quality=86)
    (O/(identifier+"-caption.txt")).write_text(story.get("caption","")+"\n",encoding="utf-8")
    print("Comic draft ready:",identifier)
if __name__=="__main__":
    make(sys.argv[1])
