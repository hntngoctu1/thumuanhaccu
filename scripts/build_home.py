# -*- coding: utf-8 -*-
"""Regenerate the homepage gallery grid in index.html from content/gallery.json.
Idempotent: matches the <div class="gallery__grid"> ... grid close and rewrites the figures."""
import os, re, json, html

ROOT = os.environ.get("SITE_ROOT") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
GAL = os.path.join(ROOT, "content", "gallery.json")

def esc(s):
    return html.escape(str(s), quote=False)

def a(s):  # attribute-safe escape (quotes too)
    return html.escape(str(s), quote=True)

_gdata = json.load(open(GAL, encoding="utf-8"))
items = _gdata["items"] if isinstance(_gdata, dict) else _gdata
figs = []
for i, it in enumerate(items):
    d = i % 3
    dd = ' data-delay="%d"' % d if d else ''
    figs.append(
        '          <figure class="gcard reveal"%s>\n'
        '            <div class="gcard__media">\n'
        '              <span class="gcard__tag">Thu mua giá cao</span>\n'
        '              <img class="gcard__img" src="%s" alt="%s" width="800" height="550" loading="lazy" decoding="async" />\n'
        '            </div>\n'
        '            <figcaption class="gcard__cap"><h3>%s</h3><span>%s</span></figcaption>\n'
        '          </figure>' % (dd, a(it["src"]), a(it["alt"]), esc(it["title"]), esc(it["brands"]))
    )
grid_inner = "\n\n".join(figs)

text = open(INDEX, encoding="utf-8").read()
pat = re.compile(r'(<div class="gallery__grid">).*?(\n        </div>\n      </div>\n    </section>)', re.S)
new, n = pat.subn(lambda m: m.group(1) + "\n" + grid_inner + m.group(2), text)
assert n == 1, "gallery grid marker not matched (%d)" % n
if new != text:
    open(INDEX, "w", encoding="utf-8").write(new)
    print("index.html gallery REGENERATED (%d cards)" % len(items))
else:
    print("index.html gallery unchanged — generator faithful (%d cards)" % len(items))
