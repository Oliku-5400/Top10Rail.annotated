/* =========================================================================
 * jackpots.ch — TOP 10 MOST POPULAR GAMES — annotated export for handoff
 * -------------------------------------------------------------------------
 * Documented copy of `Top10Rail.jsx`. Behaviour is identical; every
 * non-obvious line has an explanatory comment. Repetitive patterns are
 * explained once and referred to in subsequent occurrences.
 *
 * Integration:
 *   1. Ship this alongside React 18 + Babel Standalone (JSX is transpiled
 *      in-browser; see the production index.html for the <script> tags).
 *   2. Link the jackpots.ch tokens file `colors_and_type.css` so Roboto
 *      Black Italic (900) is available.
 *   3. Render <Top10Rail /> anywhere in your page tree.
 *
 * ─────────────────────────────────────────────────────────────
 *  DATA SOURCE — Strapi CMS
 * ─────────────────────────────────────────────────────────────
 *  The list of games is fetched at runtime from a Strapi
 *  `configuration` entry named `top10-games`. Its `data` field is a
 *  JSON array of: { rank, title, min, max, href, image }.
 *  Editors update the Top 10 by editing that entry in Strapi and
 *  clicking Publish. No code deploy required.
 *
 *  End-users cannot upload images — thumbnails are CMS-controlled.
 *
 *  If the Strapi fetch fails (network error, CMS down, etc.) the
 *  component falls back to the hardcoded TOP10_GAMES_FALLBACK list
 *  defined below so the rail never renders empty.
 * ─────────────────────────────────────────────────────────────
 *
 * Data contract: each entry in the JSON array is
 *   { rank, title, min, max, href, image }
 *     rank  1..9
 *     href  → deep link to the game detail page on jackpots.ch
 *     image → remote URL to the thumbnail, or '' for the fallback
 * ========================================================================= */


/* ---- Strapi endpoint ----------------------------------------------------
 * The Strapi instance lives at STRAPI_BASE_URL. We query the
 * `configurations` collection, filtered by the entry name. The Public
 * role in Strapi must have the `configuration: find` permission enabled.
 * -------------------------------------------------------------------------- */
const STRAPI_BASE_URL = 'https://strapi.jp.gamingenius.com';
const TOP10_CONFIG_NAME = 'top10-games';


/* ---- Brand tokens (hard-coded here so this file is self-contained) ------ */
const RED_JP = '#C10230';   // brand red — used for the giant numerals
const INK_JP = '#1D1E1B';   // primary text colour (near-black)


/* ---- Shared display-headline style --------------------------------------
 * Roboto Black Italic is the jackpots.ch display face. Centralising the
 * style keeps the heading, numerals and tile-fallback titles visually
 * consistent. Spread it with ...displayItalicJP.
 * -------------------------------------------------------------------------- */
const displayItalicJP = {
  fontFamily: 'Roboto',
  fontWeight: 900,             // "Roboto Black" == "Roboto Bk" in the brand doc
  fontStyle: 'italic',
  textTransform: 'uppercase',
  letterSpacing: '-0.01em',    // slightly tight tracking at large sizes
  lineHeight: 1,               // display-tight leading
};


/* ---- Placeholder artwork per game ---------------------------------------
 * Used ONLY when `image` is empty. Each entry maps a game title to a
 * gradient + an accent colour for the fallback wordmark, plus the game
 * provider (shown top-right).
 * -------------------------------------------------------------------------- */
const TOP10_ART = {
  'King of Olympus':       {bg: 'linear-gradient(135deg, #001E4A 0%, #00478A 50%, #8BCBFF 100%)', accent: '#FFD97A', provider: 'Playtech'},
  'Queens of Ra':          {bg: 'linear-gradient(135deg, #3A1E07 0%, #8A5A1B 55%, #E2B25A 100%)', accent: '#F8CB3B', provider: 'Games Global'},
  'Oink Oink Astronauts':  {bg: 'linear-gradient(135deg, #2A0052 0%, #7228D5 50%, #F26B43 100%)', accent: '#F8CB3B', provider: 'Playtech'},
  '4 Supercharged Clovers':{bg: 'linear-gradient(135deg, #0B3A1C 0%, #1F7A3D 55%, #F59500 100%)', accent: '#FFD97A', provider: 'Playson'},
  'Book of Ra Jewel':      {bg: 'linear-gradient(135deg, #1F1000 0%, #664011 50%, #E5A300 100%)', accent: '#FFD97A', provider: 'Playtech'},
  'Golden Crown':          {bg: 'linear-gradient(135deg, #4A1010 0%, #A60028 55%, #F59500 100%)', accent: '#F8CB3B', provider: 'Fazi'},
  'Mummy Full of Wilds':   {bg: 'linear-gradient(135deg, #1B3D0F 0%, #3B8A1F 55%, #CBE88A 100%)', accent: '#FFD97A', provider: 'Greentube'},
  'Joker 81':              {bg: 'linear-gradient(135deg, #0A0A2E 0%, #2B1B66 50%, #C10230 100%)', accent: '#F8CB3B', provider: 'Synot'},
  'Mighty Wild Panther':   {bg: 'linear-gradient(135deg, #1A1A1A 0%, #3E2E5B 55%, #6C3B9A 100%)', accent: '#F8CB3B', provider: 'Wazdan'},
};


/* ---- Fallback list ------------------------------------------------------
 * Used only if the Strapi fetch fails. Keeps the rail functional when the
 * CMS is unreachable. Same shape as the live data contract.
 *   rank  : 1..9 — rendered as the giant italic numeral on the left.
 *   title : display name (shown only when `image` is empty).
 *   min   : minimum stake, e.g. '0.10 CHF'. " CHF" is stripped at render.
 *   max   : maximum stake, same treatment.
 *   href  : deep link to the game detail page.
 *   image : thumbnail URL, or '' to show the coloured fallback tile.
 * -------------------------------------------------------------------------- */
const TOP10_GAMES_FALLBACK = [
  {rank: 1, title: 'King of Olympus',         min: '0.10 CHF', max: "30'000.00 CHF", href: 'https://www.jackpots.ch/de/spiel/gates-of-olympus-super-scatter', image: '' /* Add link here for thumbnail 1 */},
  {rank: 2, title: 'Queens of Ra',            min: '0.10 CHF', max: "12'500.00 CHF", href: 'https://www.jackpots.ch/de/spiel/big-bass-splash-1000',          image: '' /* Add link here for thumbnail 2 */},
  {rank: 3, title: 'Oink Oink Astronauts',    min: '0.20 CHF', max: "8'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/thunder-coins-xxl-hold-and-win',  image: '' /* Add link here for thumbnail 3 */},
  {rank: 4, title: '4 Supercharged Clovers',  min: '0.10 CHF', max: "6'250.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/gold-blitz',                     image: '' /* Add link here for thumbnail 4 */},
  {rank: 5, title: 'Book of Ra Jewel',        min: '0.10 CHF', max: "5'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/queens-of-ra-coin-collect',      image: '' /* Add link here for thumbnail 5 */},
  {rank: 6, title: 'Golden Crown',            min: '0.20 CHF', max: "4'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/lil-demon-mega-cash-collect',    image: '' /* Add link here for thumbnail 6 */},
  {rank: 7, title: 'Mummy Full of Wilds',     min: '0.10 CHF', max: "3'500.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/333-fat-frogs',                  image: '' /* Add link here for thumbnail 7 */},
  {rank: 8, title: 'Joker 81',                min: '0.10 CHF', max: "2'500.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/baa-baa-baa',                    image: '' /* Add link here for thumbnail 8 */},
  {rank: 9, title: 'Mighty Wild Panther',     min: '0.20 CHF', max: "2'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/supercharged-clovers-hold-and-win', image: '' /* Add link here for thumbnail 9 */},
];


/* =========================================================================
 * <Top10Card /> — one rank tile
 * -------------------------------------------------------------------------
 * Layout: a flex row containing the giant numeral (left) and the game tile
 * (right). The whole card is an <a> that navigates to `href` in a new tab.
 *
 * Props:
 *   rank, title, min, max, href, image : see TOP10_GAMES contract above
 *   size                               : 'lg' (row 1, 4-up) or 'sm' (row 2, 5-up)
 * ========================================================================= */
function Top10Card({ rank, title, min, max, href, image, size = 'lg' }) {
  // Look up the fallback artwork; default to a brand-red gradient if the
  // title isn't registered in TOP10_ART.
  const art = TOP10_ART[title] || {bg: 'linear-gradient(135deg, #6B0119, #C10230)', accent: '#F8CB3B', provider: ''};

  // Treat whitespace-only strings as "no image". This keeps the fallback
  // tile showing until the editor actually pastes a URL in.
  const hasImage = !!(image && image.trim());

  // Size presets — row 1 tiles are larger (4 across), row 2 smaller (5 across).
  const preset = size === 'lg'
    ? {numeral: 'clamp(90px, 11vw, 150px)', title: 'clamp(14px, 1.5vw, 22px)', pad: 8}
    : {numeral: 'clamp(70px, 8.5vw, 120px)', title: 'clamp(12px, 1.1vw, 18px)', pad: 6};

  return (
    // target=_blank opens in a new tab; rel=noopener,noreferrer is the
    // standard security/performance best practice for external links.
    <a href={href || '#'} target="_blank" rel="noopener noreferrer"
      style={{
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,                          // lets the tile shrink inside CSS grid cells
        textDecoration: 'none', color: 'inherit',
      }}>

      {/* Numeral + tile, side-by-side. Fixed aspect-ratio so the row keeps
          its shape at any viewport width. */}
      <div style={{
        display: 'flex', alignItems: 'center',
        aspectRatio: size === 'lg' ? '4/3' : '3/2.4',
      }}>

        {/* ----- Giant numeral (left column) -------------------------------
            aria-hidden: decorative; screen-readers skip it.
            flex: '0 0 34%' : fixed 34% of card width so the tile gets 66%.
            textShadow + WebkitTextStroke : subtle lift for legibility.
            pointerEvents:none : clicks pass through to the <a>. */}
        <div aria-hidden style={{
          flex: '0 0 34%',
          ...displayItalicJP,
          fontSize: preset.numeral,
          lineHeight: 0.85,
          color: RED_JP,
          textShadow: '0 2px 0 rgba(255,255,255,0.7), 0 8px 20px rgba(193,2,48,0.18)',
          WebkitTextStroke: '0.5px rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          userSelect: 'none',
          fontVariantNumeric: 'lining-nums',
          textAlign: 'center',
          marginRight: -4,                    // pulls italic edge toward the tile
          whiteSpace: 'nowrap',
        }}>{rank}</div>

        {/* ----- Game tile (right column) ----------------------------------
            position:relative establishes the stacking context for the
            overlays. overflow:hidden clips to the rounded rectangle. */}
        <div style={{
          flex: '1 1 auto',
          aspectRatio: '1/1',                 // tiles are square
          borderRadius: 8,
          overflow: 'hidden',
          // Dark fill behind transparent artwork; otherwise fallback gradient.
          background: hasImage ? '#1D1E1B' : art.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(29,30,27,0.22), 0 2px 4px rgba(29,30,27,0.12)',
          position: 'relative',
          transition: 'transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms cubic-bezier(0.2,0,0,1)',
        }}>

          {/* Thumbnail image. object-fit:cover fills the square cleanly —
              matches how game thumbnails render on the live site. Swap to
              'contain' if your artwork needs to show in full with letter-
              boxing. */}
          {hasImage && (
            <img src={image} alt={title} style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block',
            }}/>
          )}

          {/* Fallback wordmark — shown only when no image URL is provided.
              marginBottom reserves room so the wordmark doesn't collide
              with the Min/Max scrim overlay at the bottom. */}
          {!hasImage && (
            <div style={{
              ...displayItalicJP,
              color: art.accent,
              fontSize: preset.title,
              textAlign: 'center',
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              padding: preset.pad,
              lineHeight: 1,
              marginBottom: size === 'lg' ? 46 : 36,
            }}>{title}</div>
          )}

          {/* Provider chip (top-right). Hidden once a real thumbnail is
              shown, since the artwork already carries the provider logo. */}
          {!hasImage && art.provider && (
            <div style={{
              position: 'absolute', top: 8, right: 10,
              fontSize: 9, fontWeight: 500, letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase',
            }}>{art.provider}</div>
          )}

          {/* Min / Max overlay, pinned to the bottom of the tile.
              Soft dark gradient keeps the white text legible over any
              artwork. MIN above MAX so long amounts never overflow. */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            padding: size === 'lg' ? '10px 12px' : '7px 9px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.82) 100%)',
            color: '#fff',
            fontSize: size === 'lg' ? 11 : 10,
            fontWeight: 400,
            lineHeight: 1.35,
            display: 'flex', flexDirection: 'column', gap: 1,
            fontVariantNumeric: 'tabular-nums',   // aligns digits across rows
            letterSpacing: '0.01em',
          }}>
            {/* Each row is label (left) + amount (right). whiteSpace:nowrap
                prevents "CHF" from wrapping on narrow tiles.
                .replace(/\s*CHF\s*$/i,'') drops the CHF suffix since context
                already makes it clear we're talking money. */}
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, whiteSpace: 'nowrap'}}>
              <span style={{fontWeight: 700, letterSpacing: '0.06em'}}>MIN</span>
              <span>{min.replace(/\s*CHF\s*$/i, '')}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 8, whiteSpace: 'nowrap'}}>
              <span style={{fontWeight: 700, letterSpacing: '0.06em'}}>MAX</span>
              <span>{max.replace(/\s*CHF\s*$/i, '')}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}


/* =========================================================================
 * Strapi fetch
 * -------------------------------------------------------------------------
 * Strapi v4 response shape:
 *   { data: [ { id, attributes: { name, data: [...] } } ], meta: {...} }
 * Strapi v5 flattens `attributes` onto the entry — we handle both.
 * Any error (non-2xx, non-array payload, network) throws and the caller
 * falls back to TOP10_GAMES_FALLBACK.
 * ========================================================================= */
async function fetchTop10FromStrapi() {
  const url = `${STRAPI_BASE_URL}/api/configurations?filters[name][$eq]=${encodeURIComponent(TOP10_CONFIG_NAME)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
  const json = await res.json();
  const entry = json?.data?.[0];
  // Strapi v4 wraps fields in `.attributes`; v5 exposes them at top level.
  const payload = entry?.attributes?.data ?? entry?.data;
  if (!Array.isArray(payload)) throw new Error('Malformed Strapi payload');
  return payload;
}


/* =========================================================================
 * <Top10Rail /> — section wrapper
 * -------------------------------------------------------------------------
 * Renders the heading, then two CSS-grid rows: ranks 1–4 on top (4 columns)
 * and ranks 5–9 on bottom (5 columns). Each cell holds one <Top10Card />.
 *
 * On mount we fetch the live list from Strapi and replace the fallback.
 * The `cancelled` flag prevents a late response from updating state after
 * the component has unmounted (React 18 StrictMode re-mounts in dev).
 * Sorting by rank is defensive — editors may enter games out of order.
 * ========================================================================= */
function Top10Rail({ heading = 'TOP 10 MOST POPULAR GAMES' }) {
  const [games, setGames] = React.useState(TOP10_GAMES_FALLBACK);

  React.useEffect(() => {
    let cancelled = false;
    fetchTop10FromStrapi()
      .then(data => { if (!cancelled) setGames(data); })
      .catch(err => {
        // Non-fatal: state is already seeded with the fallback list.
        console.warn('[Top10Rail] Strapi fetch failed, using fallback:', err);
      });
    return () => { cancelled = true; };
  }, []);

  const sorted = [...games].sort((a, b) => a.rank - b.rank);

  return (
    <section style={{padding: '28px 32px'}}>

      {/* Heading. Uses the design-system .jp-h2 scale (2.25rem = 36px) to
          match other rail headings on the live site. */}
      <div style={{display: 'flex', alignItems: 'baseline', marginBottom: 18, gap: 12, flexWrap: 'wrap'}}>
        <h2 className="jp-h2" style={{...displayItalicJP, fontSize: '2.25rem', margin: 0, color: INK_JP}}>{heading}</h2>
      </div>

      {/* Row 1 — ranks 1..4, larger tiles. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',  // 4 equal columns
        gap: 20,
        marginBottom: 28,
      }}>
        {sorted.slice(0, 4).map(g => (
          <Top10Card key={g.rank} {...g} size="lg"/>
        ))}
      </div>

      {/* Row 2 — ranks 5..9, smaller tiles evenly distributed. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
      }}>
        {sorted.slice(4, 9).map(g => (
          <Top10Card key={g.rank} {...g} size="sm"/>
        ))}
      </div>
    </section>
  );
}


/* ---- Expose to other <script type="text/babel"> blocks -------------------
 * The index.html renders <Top10Rail /> from a separate inline script.
 * In a bundler (webpack/vite), replace with:
 *   export { Top10Rail, Top10Card, TOP10_GAMES, TOP10_ART };
 * -------------------------------------------------------------------------- */
Object.assign(window, { Top10Rail, Top10Card, TOP10_GAMES_FALLBACK, TOP10_ART, fetchTop10FromStrapi });
