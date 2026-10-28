#!/usr/bin/env python3
"""Produce polished illustrated 9:16 draft from generated scenes. No publishing."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

SIZE=(1080,1920)
ROOT=Path("reels-input")
OUT=Path("reels-output")
OUT.mkdir(exist_ok=True)
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def font(size,bold=False):
    return ImageFont.truetype(BOLD if bold else FONT,size)

def wrap(draw,txt,f,max_width):
    lines=[];line=""
    for word in txt.split():
        trial=(line+" "+word).strip()
        if draw.textbbox((0,0),trial,font=f)[2]>max_width and line:
            lines.append(line);line=word
        else:line=trial
    if line: lines.append(line)
    return lines

def frame(original,sc,number,outfile):
    # Crop/fill portrait while keeping the centre focal point; text overlays added here.
    w,h=original.size
    scale=max(SIZE[0]/w,SIZE[1]/h)
    img=original.resize((round(w*scale),round(h*scale)),Image.Resampling.LANCZOS)
    x=(img.width-SIZE[0])//2;y=(img.height-SIZE[1])//2
    img=img.crop((x,y,x+SIZE[0],y+SIZE[1])).convert("RGBA")
    d=ImageDraw.Draw(img,"RGBA")
    # Comfortable Instagram UI safe areas.
    d.rounded_rectangle((60,190,1020,315),radius=42,fill=(10,28,37,212))
    d.text((540,252),"PAPELES DEL BEBÉ",anchor="mm",font=font(49,True),fill="#FFFFFF")
    d.rounded_rectangle((55,1050,1025,1518),radius=46,fill=(9,23,30,198))
    title=sc["title"].strip().upper()
    tf=font(78,True)
    title_lines=wrap(d,title,tf,860)
    if len(title_lines)>3:
        tf=font(65,True);title_lines=wrap(d,title,tf,860)
    cy=1110
    for line in title_lines[:3]:
        d.text((540,cy),line,font=tf,fill="#FFF7E9",anchor="mt",stroke_width=2,stroke_fill="#131F26")
        cy+=100
    sf=font(47)
    subtitle_lines=wrap(d,sc["subtitle"].strip(),sf,870)
    cy=max(cy+18,1370)
    for line in subtitle_lines[:2]:
        d.text((540,cy),line,font=sf,fill="#FFFFFF",anchor="mt")
        cy+=64
    d.rounded_rectangle((285,1657,795,1754),radius=42,fill=(41,197,181,242))
    d.text((540,1705),"@papelesdelbebe",anchor="mm",font=font(46,True),fill="#10272B")
    img.convert("RGB").save(outfile,quality=95)

def render(identifier):
    manifest=json.loads((ROOT/(identifier+".json")).read_text(encoding="utf-8"))
    scenes=manifest["scenes"]
    if len(scenes)!=4:raise ValueError("Expected four scenes")
    work=OUT/identifier;work.mkdir(exist_ok=True,parents=True)
    clips=[]
    for i,sc in enumerate(scenes):
        picture=ROOT/(identifier+"-"+str(i)+".png")
        if not picture.exists():raise FileNotFoundError(picture)
        plate=work/("plate"+str(i)+".jpg")
        frame(Image.open(picture),sc,i,plate)
        clip=work/("scene"+str(i)+".mp4")
        # Short Ken Burns push-in: 4-second scene at 30fps.
        zoom=f"zoompan=z='min(zoom+0.00055,1.065)':d=120:s=1080x1920:fps=30,format=yuv420p"
        subprocess.run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",str(plate),
            "-vf",zoom,"-frames:v","120","-an","-c:v","libx264",
            "-preset","veryfast","-crf","23",str(clip)],check=True)
        clips.append(clip)
    listfile=work/"concat.txt"
    listfile.write_text("".join("file '"+c.name+"'\n" for c in clips),encoding="utf-8")
    narration=ROOT/(identifier+".mp3")
    if not narration.exists():raise FileNotFoundError(narration)
    result=OUT/(identifier+".mp4")
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0",
        "-i",str(listfile),"-i",str(narration),"-filter_complex",
        "[1:a]apad,atrim=duration=16,asetpts=N/SR/TB[a]",
        "-map","0:v","-map","[a]","-c:v","libx264","-preset","veryfast",
        "-crf","23","-r","30","-c:a","aac","-b:a","128k","-t","16",
        "-pix_fmt","yuv420p","-movflags","+faststart",str(result)],check=True)
    print("Borrador generado:",result)

if __name__=="__main__":
    render(sys.argv[1] if len(sys.argv)>1 else "guarderia")
