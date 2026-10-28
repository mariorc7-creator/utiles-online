#!/usr/bin/env python3
"""Generate sample silent vertical Instagram reels; review before publishing."""
import subprocess,sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
W,H=720,1280
OUT=Path('reels-output'); OUT.mkdir(exist_ok=True)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REELS={
'guarderia':[
('SER PADRES EN 2026','Creías que lo caro era el carrito…'),
('LLEGÓ LA GUARDERÍA','Y apareció una nueva suscripción mensual.'),
('EL BEBÉ NO HABLA','Pero ya tiene más gastos fijos que tú.'),
('CRIAR CON HUMOR','PapelesDelBebe.es · Síguenos para más')],
'tramites':[
('NACE TU BEBÉ','¡Enhorabuena! Ahora empieza el otro maratón.'),
('TRÁMITES Y AYUDAS','No todos se hacen automáticamente.'),
('UNA COSA CADA VEZ','Consulta requisitos y plazos oficiales.'),
('GUÍAS GRATUITAS','PapelesDelBebe.es')],
'primerizos':[
('ANTES DE SER PADRES','«Nos organizaremos fenomenal».'),
('DESPUÉS DE SER PADRES','«¿Quién ha visto el chupete?»'),
('EL CHUPETE','Estaba en la mano del bebé. Desde el principio.'),
('LA CRIANZA NO TRAE MANUAL','Pero los trámites sí tienen guía: PapelesDelBebe.es')]
}
def ft(sz,b=False):return ImageFont.truetype(BOLD if b else FONT,sz)
def lines(d,s,width,f):
 out=[]
 for raw in s.split('\\n'):
  line=''
  for word in raw.split():
   candidate=(line+' '+word).strip()
   if d.textbbox((0,0),candidate,font=f)[2]>width and line:
    out.append(line);line=word
   else:line=candidate
  out.append(line)
 return out
def scene(title,desc,i):
 palette=[('#172540','#eaf5f3','#62c9ba'),('#233251','#fff1dd','#ffad70'),('#253f49','#eef4fc','#c1a7ff'),('#183e45','#f1f7ed','#70d4b0')]
 bg,white,accent=palette[i]
 im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
 d.rounded_rectangle((40,45,W-40,135),radius=40,fill=accent)
 d.text((W//2,90),'PAPELES DEL BEBÉ',font=ft(30,True),fill=bg,anchor='mm')
 d.ellipse((112,210,608,706),fill=accent)
 d.ellipse((148,248,572,672),fill=white)
 d.text((W//2,458),f'{i+1:02d}',font=ft(168,True),fill=bg,anchor='mm')
 ys=lines(d,title,620,ft(55,True));y=790-30*(len(ys)-1)
 for l in ys:
  d.text((W//2,y),l,font=ft(55,True),fill=white,anchor='mm');y+=75
 y=max(1010,y+20)
 for l in lines(d,desc,620,ft(29)):
  d.text((W//2,y),l,font=ft(29),fill=white,anchor='mm');y+=44
 d.rounded_rectangle((135,1183,585,1229),radius=20,fill=accent)
 d.text((W//2,1206),'@papelesdelbebe',font=ft(25,True),fill=bg,anchor='mm')
 return im
def render(name):
 slides=REELS[name];work=OUT/name;work.mkdir(exist_ok=True)
 for i,(t,desc) in enumerate(slides):scene(t,desc,i).save(work/f'{i}.png')
 inputs=[]
 for i in range(4):inputs+=['-loop','1','-t','4.5','-i',str(work/f'{i}.png')]
 filters=''.join(f'[{i}:v]fps=15,format=yuv420p,setsar=1[v{i}];' for i in range(4))
 filters+='[v0][v1]xfade=transition=fade:duration=0.5:offset=4.0[x1];[x1][v2]xfade=transition=fade:duration=0.5:offset=8.0[x2];[x2][v3]xfade=transition=fade:duration=0.5:offset=12.0[out]'
 subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',filters,'-map','[out]','-an','-c:v','libx264','-preset','veryfast','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{name}.mp4')],check=True)
if __name__=='__main__':
 for name in sys.argv[1:] or REELS.keys():render(name)
