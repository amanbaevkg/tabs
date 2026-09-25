#!/usr/bin/env python3
"""Assemble the Cloud Power concept pages.

Each file in src/pages/ starts with a JSON block in an HTML comment (page settings), then an optional
<style> block, the page's own <main> content, and an optional <script> block.
The shared header, footer, "other services" row, closing contact band, CSS and JS are added here,
so every page uses exactly the same design system. Output files are written next to index.html.
"""
import json, pathlib, re

SRC = pathlib.Path(__file__).parent
OUT = SRC.parent
BASE_CSS = (SRC / 'base.css').read_text()
BASE_JS = (SRC / 'base.js').read_text()

SERVICES = [  # (key, file, menu label)
    ('managed', 'managed-services.html', 'Managed Services'),
    ('ai', 'ai.html', 'AI'),
    ('soc', 'soc-as-a-service.html', 'SOC as a Service'),
    ('consulting', 'consulting.html', 'Consulting'),
    ('dc', 'digital-conception.html', 'Digital Conception'),
]
ARROW = '<svg aria-hidden="true"><use href="#arr"/></svg>'
SYMBOLS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="arr" viewBox="0 0 24 24"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
  <symbol id="diag" viewBox="0 0 24 24"><path d="M6 18L18 6M8.5 6H18v9.5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
  <symbol id="left" viewBox="0 0 24 24"><path d="M21 12H4M10 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
</svg>'''


def cur(flag):
    return ' aria-current="page"' if flag else ''


def header(nav):
    in_services = nav in [k for k, _, _ in SERVICES] or nav == 'services'
    items = '\n'.join(f'          <a href="{f}"{cur(nav == k)}>{label}</a>' for k, f, label in SERVICES)
    return f'''<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html"><img src="assets/cp-logo.webp" alt="Cloud Power Luxembourg" width="500" height="303"><span>Cloud <b>Power</b></span></a>
    <nav aria-label="Main">
      <div class="dd{' cur' if in_services else ''}">
        <a href="our-services.html" class="dd-top" aria-haspopup="true"{cur(nav == 'services')}>Our Services<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></a>
        <div class="dd-menu">
{items}
          <a class="all" href="our-services.html">All services</a>
        </div>
      </div>
      <a href="news.html"{cur(nav == 'news')}>News</a>
    </nav>
    <a class="slash solid" href="contact-us.html">Contact Us</a>
  </div>
</header>'''


FOOTER = '''<footer class="site-footer">
  <div class="wrap">
    <div class="foot">
      <a class="brand" href="index.html"><img src="assets/cp-logo.webp" alt="Cloud Power Luxembourg" width="500" height="303"><span>Cloud <b>Power</b></span></a>
      <ul class="foot-links">
        <li><a href="our-services.html">Our Services</a></li>
        <li><a href="news.html">News</a></li>
        <li><a href="contact-us.html">Contact Us</a></li>
        <li><a href="https://www.linkedin.com/company/cplux">Linkedin</a></li>
      </ul>
    </div>
    <p class="legal">© 2025 Cloud Power Luxembourg SA</p>
  </div>
</footer>'''


def others(nav):
    links = '\n'.join(f'      <li><a href="{f}">{label}</a></li>' for k, f, label in SERVICES if k != nav)
    return f'''<section class="others" aria-label="Our Services">
  <div class="wrap">
    <a class="kicker mono" href="our-services.html" style="text-decoration:none">Our Services</a>
    <ul>
{links}
    </ul>
  </div>
</section>'''


def close(c):
    p = f'\n      <p>{c["p"]}</p>' if c.get('p') else ''
    return f'''<section class="close">
  <div class="wrap">
    <div>
      <h2 class="rv">{c["h"]}</h2>{p}
    </div>
    <a class="slash solid rv" href="contact-us.html">Contact Us{ARROW}</a>
  </div>
</section>'''


def build(path):
    raw = path.read_text()
    meta = json.loads(re.match(r'\s*<!--(.*?)-->', raw, re.S).group(1))
    rest = raw[raw.index('-->') + 3:]
    css = ''.join((SRC / f).read_text() for f in meta.get('css', [])) + ''.join(re.findall(r'<style>(.*?)</style>', rest, re.S))
    js = ''.join(re.findall(r'<script>(.*?)</script>', rest, re.S))
    body = re.sub(r'<style>.*?</style>|<script>.*?</script>', '', rest, flags=re.S).strip()
    nav = meta.get('nav', '')
    parts = [body]
    if meta.get('others'):
        parts.append(others(nav))
    if meta.get('close'):
        parts.append(close(meta['close']))
    note = meta.get('note')
    appendix = f'''<section class="appendix" aria-label="Review notes">
  <div class="wrap">
    <h2>Review notes (not part of the design)</h2>
    {''.join(f'<p>{n}</p>' for n in note)}
  </div>
</section>''' if note else ''
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{meta["title"]}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400;500&display=swap">
<style>
{BASE_CSS}
/* ============ page: {path.stem} ============ */
{css.strip()}
</style>
</head>
<body>
{SYMBOLS}
<div class="ribbon" role="note"><div class="wrap"><span><b>Cloud Power</b> · site concept V2 · {meta["ribbon"]} · desktop 1440 px · internal review</span><span>all text from cloud-power.eu · <a href="index.html">homepage</a></span></div></div>
{header(nav)}
<main>
{chr(10).join(parts)}
</main>
{FOOTER}
{appendix}
<script>
{BASE_JS}
</script>
{f"<script>{js}</script>" if js.strip() else ''}
</body>
</html>
'''
    out = OUT / (meta['file'])
    out.write_text(html)
    return out.name


if __name__ == '__main__':
    for p in sorted((SRC / 'pages').glob('*.html')):
        print('built', build(p))
