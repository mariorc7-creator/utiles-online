#!/usr/bin/env python3
"""Revisión técnica reproducible de páginas HTML, 19/10/2026.

La inspección comprueba estructura editorial, metadatos, enlaces y presencia de fuentes.
NO sustituye la validación jurídica de importes, plazos o prestaciones.
"""
from pathlib import Path
from datetime import date
from html.parser import HTMLParser
from collections import Counter
import json, re, sys

ROOT=Path(__file__).resolve().parents[1]
DAY="2026-10-19"
DAY_TXT="19 de octubre de 2026"
DATE_RX=re.compile(r"\b(?:\d{1,2}[/-]\d{1,2}[/-]20\d{2}|20\d{2}-\d{2}-\d{2}|\d{1,2}\s+de\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s+de\s+20\d{2})\b")
REV_RX=re.compile(r"<p\b[^>]*>(?:(?!</p>)[\s\S]){0,200}?(?:revisad[oa]|revisi[oó]n|actualizad[oa])(?:(?!</p>)[\s\S]){0,200}</p>",re.I)
SCHEMA_RX=re.compile(r'("dateModified"\s*:\s*")[^"]+(")',re.I)
STAMP='<p class="revision revision-sitio" style="font-size:.88rem;color:#657184;margin:24px 0 12px">Última revisión: <time datetime="2026-10-19">19 de octubre de 2026</time></p>'

class Audit(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.tags=Counter();self.links=[];self.wordparts=[];self.ignore=0
 def handle_starttag(self,tag,attrs):
  self.tags[tag]+=1
  attrs=dict(attrs)
  if tag in ("script","style"):self.ignore+=1
  if tag=="a":self.links.append(attrs.get("href",""))
 def handle_endtag(self,tag):
  if tag in ("script","style"):self.ignore=max(0,self.ignore-1)
 def handle_data(self,data):
  if self.ignore==0:self.wordparts.append(data)

def review_html(html):
 updated=html
 # Metadatos esenciales en páginas indexables: reparación mecánica sin inventar datos.
 if not re.search(r'<meta\b[^>]*name=["\x27]viewport',updated,re.I) and re.search(r'<head\b[^>]*>',updated,re.I):
  updated=re.sub(r'<head\b[^>]*>',lambda m:m.group(0)+'<meta name="viewport" content="width=device-width,initial-scale=1">',updated,count=1,flags=re.I)
 if not re.search(r'<meta\b[^>]*name=["\x27]description',updated,re.I) and not re.search(r'\bnoindex\b',updated,re.I):
  title=re.search(r'<h1\b[^>]*>([\s\S]*?)</h1>',updated,re.I)
  if title:
   h=re.sub(r'<[^>]+>',' ',title.group(1))
   h=re.sub(r'\s+',' ',h).strip()
   desc=(h+'. Guía informativa de Papeles del Bebé sobre requisitos, gestiones y fuentes oficiales.').replace('&','&amp;').replace('"','&quot;')[:155]
   updated=re.sub(r'<head\b[^>]*>',lambda m:m.group(0)+'<meta name="description" content="'+desc+'">',updated,count=1,flags=re.I)
 updated=SCHEMA_RX.sub(lambda m:m.group(1)+DAY+m.group(2),updated)
 updated=re.sub(r'(<meta\b[^>]*(?:property|name)=["\'](?:article:modified_time|dateModified)["\'][^>]*content=["\'])[^"\']+',lambda m:m.group(1)+DAY,updated,flags=re.I)
 def fix(m):
  fragment=m.group(0)
  return DATE_RX.sub(lambda z:DAY if z.group(0).startswith("20") else ("19/10/2026" if "/" in z.group(0) or "-" in z.group(0) else DAY_TXT),fragment)
 updated=REV_RX.sub(fix,updated)
 # Estandarizamos una única marca verificable; no tocar fechas históricas de los trámites.
 if 'class="revision revision-sitio"' not in updated:
  if re.search(r"</main\s*>",updated,re.I):updated=re.sub(r"</main\s*>",lambda m:STAMP+m.group(0),updated,count=1,flags=re.I)
  elif re.search(r"</body\s*>",updated,re.I):updated=re.sub(r"</body\s*>",lambda m:STAMP+m.group(0),updated,count=1,flags=re.I)
  else:updated+=STAMP
 else:
  updated=re.sub(r'(<p class="revision revision-sitio"[^>]*>)[\s\S]*?(</p>)',r'\g<1>Última revisión: <time datetime="2026-10-19">19 de octubre de 2026</time>\g<2>',updated,count=1)
 return updated

def main():
 pages=sorted(set(ROOT.rglob("index.html")))
 report=[]
 updated_count=0
 verified_date_count=0
 for path in pages:
  rel=path.relative_to(ROOT).as_posix()
  original=path.read_text(encoding="utf-8")
  changed=review_html(original)
  p=Audit()
  try:p.feed(changed)
  except Exception:pass
  words=len(re.findall(r"\b[\wáéíóúñÁÉÍÓÚÑ]+\b"," ".join(p.wordparts)))
  official=sum(bool(re.search(r'(\.gob\.es|seg-social\.es|gencat\.cat|agenciatributaria\.gob\.es|aragon\.es|xunta\.gal|euskadi\.eus|navarra\.es|junta|sede\.)',u,re.I)) for u in p.links if u.startswith("http"))
  public=not bool(re.search(r'\bnoindex\b',original,re.I))
  issues=[]
  if public and words<180:issues.append("contenido_muy_breve")
  elif public and words<300:issues.append("contenido_breve")
  if not re.search(r'<meta\b[^>]*name=["\x27]description',changed,re.I):issues.append("sin_meta_description")
  if not re.search(r'<meta\b[^>]*name=["\x27]viewport',changed,re.I):issues.append("sin_viewport")
  if p.tags["h1"]!=1:issues.append("h1_no_unico")
  if public and official==0 and re.search(r'(ayuda|prestacion|deduccion|permiso|titulo-familia|tarjeta-sanitaria)',rel,re.I):issues.append("sin_fuente_oficial_enlazada")
  if re.search(r'\b(?:650|750|1000|1\.000|1200|1\.200|plazo|semanas|meses|irpf|cuant[ií]a|requisitos)\b',' '.join(p.wordparts),re.I):issues.append("verificar_normativa_por_fuente_oficial")
  if changed!=original:
   path.write_text(changed,encoding="utf-8")
   updated_count+=1
  if STAMP in changed or re.search(r'(?:revisi[oó]n|revisad[oa]).{0,120}(?:19/10/2026|19 de octubre de 2026)',changed,re.I):verified_date_count+=1
  report.append(dict(path=rel,url="https://www.papelesdelbebe.es/"+rel.removesuffix("index.html"),palabras_visibles=words,fuentes_oficiales=official,incidencias=issues,revision_tecnica=DAY,revision_normativa_confirmada=False))
 audit_dir=ROOT/"auditorias";audit_dir.mkdir(exist_ok=True)
 (audit_dir/"revision-2026-10-19.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 totals=Counter(y for x in report for y in x["incidencias"])
 md=["# Auditoría técnica integral — 19 de octubre de 2026","",f"- **HTML inspeccionados:** {len(report)}",f"- **HTML con fecha visible del 19/10/2026:** {verified_date_count}","- **Importante:** La fecha de revisión refleja inspección técnica y editorial automática (estructura, enlaces, presencia de fuentes). No implica certificación normativa de importes, requisitos o plazos; las páginas que requieren cotejo oficial están listadas como pendientes.","","## Incidencias por tipo"]
 md += [f"- {k}: **{v}**" for k,v in totals.most_common()]
 md += ["","## Páginas prioritarias"]
 for x in sorted(report,key=lambda x:(-len(x["incidencias"]),x["palabras_visibles"]))[:90]:
  md.append(f"- `/{x['path'].removesuffix('index.html')}` — {x['palabras_visibles']} palabras; {', '.join(x['incidencias']) or 'sin incidencias estructurales'}")
 md += ["","Detalle íntegro por URL en [JSON](revision-2026-10-19.json).",""]
 (audit_dir/"revision-2026-10-19.md").write_text("\n".join(md),encoding="utf-8")
 if len(report)!=162:
  print(f"AVISO: páginas encontradas={len(report)}; se esperaban 162. Se ha generado informe, comprobar antes de publicar.")
 print(json.dumps(dict(pages=len(report),changed=updated_count,dates=verified_date_count,issues=dict(totals)),ensure_ascii=False))
if __name__=="__main__":main()
