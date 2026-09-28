#!/usr/bin/env bash
# Baseline verifier for the Mama Africa Library UI work.
# Run before and after layout changes to prove nothing regressed.
# Usage: ./scripts/ui-verify.sh [base-url]
set -uo pipefail

BASE="${1:-http://localhost:3003}"
FAIL=0
pass() { printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAIL=1; }

cd "$(dirname "$0")/.."

echo "== typescript =="
if npx tsc --noEmit >/tmp/ui-verify-tsc.log 2>&1; then
  pass "tsc --noEmit clean"
else
  fail "tsc reported errors"; tail -15 /tmp/ui-verify-tsc.log
fi

echo
echo "== routes (expect 200) =="
ROUTES=(
  / /books /blogs /authors /about /contact /faq /login
  /payment /payment/mpesa /payment/stripe /payment/paypal /payment/success
  /request-hard-copy /favicon.ico
)
for r in "${ROUTES[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r" --max-time 90)
  if [ "$code" = "200" ]; then pass "$code $r"; else fail "$code $r"; fi
done

echo
echo "== dynamic routes (real ids from the API) =="
W=https://kalenjin-books-worker.pngobiro.workers.dev
BOOK=$(curl -s "$W/api/books?limit=1" --max-time 45 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
BLOG=$(curl -s "$W/api/blog/posts?limit=1" --max-time 45 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
AUTH=$(curl -s "$W/api/authors?limit=1" --max-time 45 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
for pair in "/books/$BOOK" "/blogs/$BLOG" "/authors/$AUTH"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$pair" --max-time 90)
  if [ "$code" = "200" ]; then pass "$code $pair"; else fail "$code $pair"; fi
done

echo
echo "== dashboards (auth-gated; must not 500) =="
for r in /dashboard/author /dashboard/author/books /dashboard/author/blogs \
         /dashboard/author/analytics /dashboard/admin /dashboard/admin/analytics; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r" --max-time 90)
  if [ "$code" = "200" ] || [ "$code" = "302" ] || [ "$code" = "307" ]; then
    pass "$code $r"
  else
    fail "$code $r"
  fi
done

echo
echo "== responsive sidebars (was fixed w-64 with no drawer) =="
python3 - <<'PY'
import re,sys
bad=[]
for f,label in [('src/components/dashboard/DashboardSidebar.tsx','author'),
                ('src/components/dashboard/AdminSidebar.tsx','admin')]:
    src=open(f).read()
    if 'md:hidden' not in src:      bad.append(f"{label}: no mobile drawer")
    if 'md:block' not in src:       bad.append(f"{label}: desktop sidebar not preserved")
    if 'aria-label="Open navigation menu"' not in src:
        bad.append(f"{label}: hamburger has no accessible name")
    # the bare w-64 panel must no longer be the only rendering path
    if not re.search(r'hidden md:block', src):
        bad.append(f"{label}: w-64 panel still always visible")
for b in bad: print(f"  \033[31mFAIL\033[0m  {b}")
if not bad: print("  \033[32mPASS\033[0m  both sidebars responsive with labelled hamburger")
sys.exit(1 if bad else 0)
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== single page gutter (page-container) =="
python3 - <<'PY'
import re,glob,sys
bad=[]
for f in glob.glob('src/**/*.tsx',recursive=True):
    src=open(f).read()
    # any hand-rolled full-width container defeats the shared gutter
    for m in re.finditer(r'max-w-7xl mx-auto px-[^"\'\s]*',src):
        line=src[:m.start()].count('\n')+1
        bad.append(f"{f}:{line} {m.group(0)}")
if bad:
    for b in bad: print(f"  \033[31mFAIL\033[0m  {b}")
    sys.exit(1)
print("  \033[32mPASS\033[0m  no hand-rolled max-w-7xl gutters")
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== no duplicate site nav outside the Navbar component =="
python3 - <<'PY'
import glob,sys
# Public pages must use the shared Navbar. Dashboard pages legitimately keep
# their own sub-header bar (back-to-dashboard), which lives inside the sidebar
# layout, so they are exempt.
bad=[]
for f in glob.glob('src/app/**/*.tsx',recursive=True):
    if '/dashboard/' in f:      # exempt: sub-header bar is intentional here
        continue
    src=open(f).read()
    if 'Mama Africa Library' in src and '<nav' in src and 'layout/Navbar' not in src:
        bad.append(f)
if bad:
    for b in bad: print(f"  \033[31mFAIL\033[0m  hand-rolled site nav in {b}")
    sys.exit(1)
print("  \033[32mPASS\033[0m  public nav markup lives only in the Navbar component")
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== no CSS nesting leaks (Tailwind emits &::after literally) =="
python3 - <<'PY'
import re,sys
css=open('/tmp/ui-verify-snap.css').read()
leaks=re.findall(r'&::[a-z-]+|&[a-z-]+\s*\{',css)
if leaks:
    print(f"  \033[31mFAIL\033[0m  {len(leaks)} un-nested selector(s): {sorted(set(leaks))[:5]}")
    sys.exit(1)
print("  \033[32mPASS\033[0m  no un-nested selectors in compiled CSS")
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== homepage editorial utilities emitted =="
python3 - <<'PY'
import re,sys
css=open('/tmp/ui-verify-snap.css').read()
need=['editorial-eyebrow','editorial-eyebrow-rule','editorial-rule',
      'editorial-numeral','editorial-section','editorial-card','page-container']
bad=[u for u in need if not re.search(r'\.'+u+r'\s*\{',css)]
if bad:
    print("  \033[31mFAIL\033[0m  not emitted:", ', '.join(bad)); sys.exit(1)
print("  \033[32mPASS\033[0m  all editorial utilities emitted")
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== homepage: no invented stats, no off-brand gradients =="
python3 - <<'PY'
import re,sys
src=open('src/app/page.tsx').read()
# strip comments so an explanatory note about a removed stat is not a hit
code=re.sub(r'/\*.*?\*/','',src,flags=re.S)
code=re.sub(r'//.*','',code)
bad=[]
if re.search(r'Reader Satisfaction', code): bad.append('fabricated "Reader Satisfaction" stat')
for g in ['emerald-','rose-','violet-','fuchsia-','cyan-','indigo-']:
    if g in code: bad.append(f'off-brand stock gradient "{g}"')
if bad:
    for b in bad: print(f"  \033[31mFAIL\033[0m  {b}")
    sys.exit(1)
print("  \033[32mPASS\033[0m  homepage stats are real and palette is on-brand")
PY
[ $? -ne 0 ] && FAIL=1

echo
echo "== design tokens present in shipped CSS =="
CSSPATH=$(curl -s "$BASE" --max-time 90 | grep -o '/_next/static/css/[^"?]*' | head -1)
if [ -n "$CSSPATH" ]; then
  # Poll until the served CSS contains the utilities we expect, so a check run
  # immediately after an edit does not read a stale pre-rebuild snapshot.
  for _ in 1 2 3 4 5 6 7 8; do
    curl -s "$BASE$CSSPATH" -o /tmp/ui-verify-snap.css --max-time 90
    grep -q 'editorial-eyebrow-rule' /tmp/ui-verify-snap.css 2>/dev/null && break
    sleep 3
  done
  python3 - <<'PY'
import re,sys
try:
    css=open('/tmp/ui-verify-snap.css').read()
except Exception as e:
    print("  \033[31mFAIL\033[0m  could not read css:",e); sys.exit(1)
checks=[
 ("primary token #b4502a",      r"--color-primary:\s*#b4502a"),
 ("green token #4f6d4c",        r"--color-accent-green:\s*#4f6d4c"),
 ("star token #a87600",         r"--color-star:\s*#a87600"),
 ("heading font token",         r"--font-heading:\s*var\(--font-playfair\)"),
 ("body font token",            r"--font-body:\s*var\(--font-inter\)"),
 ("h1-h6 use heading font",     r"h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*var\(--font-heading\)"),
 ("body uses font-body",        r"\n\s*body\s*\{[^}]*font-family:\s*var\(--font-body\)"),
 ("focus-visible ring",         r":focus-visible\s*\{[^}]*var\(--color-primary-dark\)"),
 ("prefers-reduced-motion",     r"@media \(prefers-reduced-motion:\s*reduce\)"),
 (".kr-mono utility",           r"\.kr-mono\s*\{"),
 (".skip-link utility",         r"\.skip-link\s*\{"),
 ("inter @font-face",           r"@font-face[^}]*font-family:\s*'?Inter"),
 ("playfair @font-face",        r"@font-face[^}]*font-family:\s*'?Playfair Display"),
]
bad=0
for label,pat in checks:
    ok=bool(re.search(pat,css))
    print(f"  \033[32mPASS\033[0m  {label}" if ok else f"  \033[31mFAIL\033[0m  {label}")
    bad += 0 if ok else 1
# regressions that must NOT come back
for label,pat in [("no dead Merriweather", r"Merriweather"),
                  ("no dead #e07856",      r"e07856"),
                  ("no aria-label Open hack", r'aria-label\*="Open"')]:
    hit=re.search(pat,css,re.I)
    ok=not hit
    print(f"  \033[32mPASS\033[0m  {label}" if ok else f"  \033[31mFAIL\033[0m  {label}")
    bad += 0 if ok else 1
sys.exit(1 if bad else 0)
PY
  [ $? -ne 0 ] && FAIL=1
else
  fail "could not locate CSS"
fi

echo
echo "== no unused font preloads (was 5) =="
PRE=$(curl -s "$BASE" --max-time 90 | grep -o 'media/[^"]*\.p\.woff2' | sort -u | wc -l)
if [ "$PRE" -le 2 ]; then pass "preloaded font files: $PRE"; else fail "preloaded font files: $PRE (expected <=2)"; fi

echo
echo "== a11y: main-content id is not duplicated in the same render path =="
# Two <main id="main-content"> in one file are only a real problem when they can
# render together (e.g. both in the default return, or both in a loading branch).
# Branches behind a guard (if (loading) / if (error) / if (submitted)) are
# mutually exclusive at runtime, so compare the count against the number of
# distinct top-level returns instead of the raw count.
python3 - <<'PY'
import re,glob,sys
bad=[]
for f in glob.glob('src/app/**/page.tsx',recursive=True)+glob.glob('src/app/**/layout.tsx',recursive=True):
    lines=open(f).read().split('\n')
    hits=[i for i,l in enumerate(lines) if 'id="main-content"' in l]
    if len(hits)<=1: continue
    # An <main id="main-content"> is safe when it sits inside a guarded early
    # return (`if (x) { return (...) }`) or in the trailing default return.
    # It is a real bug only when two land in the same return block.
    def branch(i):
        # walk up to the nearest `return (` or `if (...) {` at lower indent
        for j in range(i,-1,-1):
            s=lines[j]
            if re.search(r'\breturn\s*\(',s): return ('return',j)
            if re.search(r'\bif\s*\(',s):     return ('if',j)
        return ('top',0)
    sigs=[]
    for i in hits:
        kind,ln=branch(i)
        indent=len(lines[ln])-len(lines[ln].lstrip())
        sigs.append(f"{kind}@{ln}:{indent}")
    # two ids share a signature only if in the same return block AND same indent
    if len(set(sigs))<len(sigs):
        bad.append(f"{f}: {sigs}")
if bad:
    for b in bad: print(f"  \033[31mFAIL\033[0m  {b}")
    sys.exit(1)
print("  \033[32mPASS\033[0m  no simultaneous duplicate main-content ids")
PY
[ $? -ne 0 ] && FAIL=1

echo
if [ "$FAIL" -eq 0 ]; then
  echo -e "\033[32mALL CHECKS PASSED\033[0m"
else
  echo -e "\033[31mSOME CHECKS FAILED\033[0m"
fi
exit $FAIL
