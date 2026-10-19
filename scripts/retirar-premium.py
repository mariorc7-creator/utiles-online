#!/usr/bin/env python3
"""Retira Premium de la experiencia pública, preservando herramientas gratuitas.
Uso: python3 scripts/retirar-premium.py
"""
from pathlib import Path
from html import escape
import re,json

ROOT=Path(__file__).resolve().parents[1]
changed=[]
remaining=[]
redirects={"/premium/":"/mi-panel/","/premium/plan/":"/mi-panel/","/premium/gracias/":"/mi-panel/","/premium/cancelado/":"/mi-panel/","/premium/prueba-stripe/":"/mi-panel/"}
for path in sorted(ROOT.rglob("*.html")):
    rel=path.relative_to(ROOT).as_posix()
    original=path.read_text(encoding="utf-8")
    if rel.startswith("premium/"):
        canonical="/"+rel.removesuffix("index.html")
        target="/mi-panel/"
        new=f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contenido disponible en Mi panel | Papeles del Bebé</title><meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="https://www.papelesdelbebe.es{target}">
</head><body><main><h1>El contenido se ha trasladado a Mi panel</h1><p>Para organizar tus trámites y ayudas de forma gratuita, abre <a href="{target}">Mi panel de Papeles del Bebé</a>.</p></main>
<script>location.replace("{target}")</script></body></html>"""
    else:
        new=original
        # Remove any simple action links to retired premium pages. Do not remove non-Premium controls.
        new=re.sub(r'<a\b(?=[^>]*\bhref\s*=\s*["\x27]/premium(?:/[^"\x27]*)?["\x27])[^>]*>[\s\S]*?</a>', '',new,flags=re.I)
        new=re.sub(r'<script\b(?=[^>]*\bsrc\s*=\s*["\x27][^"\x27]*premium/premium-flow\.js[^"\x27]*["\x27])[^>]*>\s*</script>', '',new,flags=re.I)
        # Replace copy suggesting Premium is needed to use free tools, leaving legitimate wording otherwise.
        new=new.replace("Mi panel, la checklist y Premium","Mi panel y la checklist")
        # Remove leftover empty navigation wrappers only if already empty.
        new=re.sub(r'<p[^>]*>\s*</p>', '',new)
    if new!=original:
        path.write_text(new,encoding="utf-8")
        changed.append(rel)
    if not rel.startswith("premium/") and re.search(r'(?i)(?:/premium/|plan premium|premium gratis|nav-premium)',new):
        remaining.append(rel)
ROOT.joinpath("auditorias").mkdir(exist_ok=True)
report={"removed_from":changed,"remaining_premium_references_for_manual_review":remaining,"redirected_old_premium_pages":list(redirects)}
ROOT.joinpath("auditorias","retirada-premium-2026-10-19.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"modified_count":len(changed),"remaining_count":len(remaining),"modified":changed[:30],"remaining":remaining},ensure_ascii=False))
