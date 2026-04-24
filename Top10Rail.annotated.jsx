/* =========================================================================
 * jackpots.ch — TOP 10 MOST POPULAR GAMES — annotated export for handoff
 * -------------------------------------------------------------------------
 * This file is a DOCUMENTED copy of the production component in
 * `Top10Rail.jsx`. Behaviour is identical; every non-obvious line has an
 * explanatory comment. Repetitive patterns are explained once and referred
 * to in subsequent occurrences.
 *
 * Integration:
 *   1. Ship this alongside React 18 + Babel Standalone (JSX is transpiled
 *      in-browser; see the production index.html for the <script> tags).
 *   2. Link the jackpots.ch tokens file `colors_and_type.css` so Roboto
 *      Black Italic (900) is available.
 *   3. Render <Top10Rail /> anywhere in your page tree — in our lobby it
 *      sits between «AKTUELL BELIEBT» and «NEU IM PORTFOLIO».
 *
 * Data contract: each entry in TOP10_GAMES is
 *   { rank, title, min, max, href } — rank 1..9, href → deep link to the
 *   game detail page on jackpots.ch. Per-card image uploads are stored in
 *   localStorage under the key `jp-top10-img-<rank>`.
 * ========================================================================= */


/* ---- Brand tokens (hard-coded here so this file is self-contained) ------ */
const RED_JP       = '#C10230';   // brand red — used for the giant numerals
const RED_HOVER_JP = '#A80228';   // hover/pressed variant of brand red
const INK_JP       = '#1D1E1B';   // primary text colour (near-black)


/* ---- Shared display-headline style --------------------------------------
 * Roboto Black Italic is the jackpots.ch display face. Centralising the
 * style here keeps the heading, numerals and tile-fallback titles visually
 * consistent (and editable in one place). Spread it with ...displayItalicJP.
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
 * Used ONLY when no image has been uploaded for a tile. Each entry maps a
 * game title to a gradient + an accent colour for the fallback wordmark,
 * plus the game provider (shown top-right).
 *
 * In production you'd replace these gradient placeholders with the real
 * game thumbnails; the upload flow below already supports that per-card.
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


/* ---- Data: the Top 9 list -----------------------------------------------
 * rank  : 1..9 — rendered as the giant italic numeral on the left of the tile.
 * title : display name (shown only when no image is uploaded).
 * min   : minimum stake, e.g. '0.10 CHF'. " CHF" is stripped at render time
 *         to save horizontal space in the overlay.
 * max   : maximum stake, same treatment.
 * href  : deep link to the game detail page on jackpots.ch — the entire
 *         card becomes an <a> pointing here.
 * -------------------------------------------------------------------------- */
const TOP10_GAMES = [
  {rank: 1, title: 'King of Olympus',        min: '0.10 CHF', max: "30'000.00 CHF", href: 'https://www.jackpots.ch/de/spiel/gates-of-olympus-super-scatter'},
  {rank: 2, title: 'Queens of Ra',           min: '0.10 CHF', max: "12'500.00 CHF", href: 'https://www.jackpots.ch/de/spiel/big-bass-splash-1000'},
  {rank: 3, title: 'Oink Oink Astronauts',   min: '0.20 CHF', max: "8'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/thunder-coins-xxl-hold-and-win'},
  {rank: 4, title: '4 Supercharged Clovers', min: '0.10 CHF', max: "6'250.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/gold-blitz'},
  {rank: 5, title: 'Book of Ra Jewel',       min: '0.10 CHF', max: "5'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/queens-of-ra-coin-collect'},
  {rank: 6, title: 'Golden Crown',           min: '0.20 CHF', max: "4'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/lil-demon-mega-cash-collect'},
  {rank: 7, title: 'Mummy Full of Wilds',    min: '0.10 CHF', max: "3'500.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/333-fat-frogs'},
  {rank: 8, title: 'Joker 81',               min: '0.10 CHF', max: "2'500.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/baa-baa-baa'},
  {rank: 9, title: 'Mighty Wild Panther',    min: '0.20 CHF', max: "2'000.00 CHF",  href: 'https://www.jackpots.ch/de/spiel/supercharged-clovers-hold-and-win'},
];


/* =========================================================================
 * <Top10Card /> — one rank tile
 * -------------------------------------------------------------------------
 * Layout: a flex row containing the giant numeral (left) and the game tile
 * (right). The whole card is an <a> that navigates to `href` in a new tab.
 * Hovering the card shows an Upload button; clicking it lets the user pick
 * a local image which is stored in localStorage and rendered with
 * object-fit: contain so any aspect ratio looks correct.
 *
 * Props:
 *   rank, title, min, max, href : see TOP10_GAMES contract above
 *   size                        : 'lg' (row 1, 4-up) or 'sm' (row 2, 5-up)
 * ========================================================================= */
function Top10Card({ rank, title, min, max, href, size = 'lg' }) {
  // Look up the fallback artwork; default to a brand-red gradient if the
  // title isn't registered in TOP10_ART.
  const art = TOP10_ART[title] || {bg: 'linear-gradient(135deg, #6B0119, #C10230)', accent: '#F8CB3B', provider: ''};

  // Per-rank localStorage key — keeps uploads for rank 1 separate from rank 2.
  const storageKey = `jp-top10-img-${rank}`;

  // userImg : the currently-displayed uploaded image as a base64 data URL
  // (empty string means "no upload, show the fallback"). We seed state from
  // localStorage so a refresh doesn't lose the image.
  const [userImg, setUserImg] = React.useState(() => {
    try { return localStorage.getItem(storageKey) || ''; } catch { return ''; }
  });

  // Hover state drives visibility of the Upload/Clear buttons so they don't
  // clutter the design at rest.
  const [hover, setHover] = React.useState(false);

  // Ref to the hidden <input type="file"> — clicking the styled Upload
  // button programmatically clicks this input to open the OS file picker.
  const fileInputRef = React.useRef(null);

  /** Read the chosen file as a base64 data URL and persist it. */
  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setUserImg(dataUrl);
      // try/catch because localStorage can throw (private mode, quota full).
      try { localStorage.setItem(storageKey, dataUrl); } catch {}
    };
    reader.readAsDataURL(f);
  };

  /** Clear the uploaded image — used by the small × button. */
  const clearImg = (e) => {
    // stopPropagation so the click doesn't bubble to the <a> and navigate.
    // preventDefault so it doesn't activate the link either.
    e.stopPropagation();
    e.preventDefault();
    setUserImg('');
    try { localStorage.removeItem(storageKey); } catch {}
  };

  // Size presets — row 1 tiles are larger (4 across) so text/numeral sizes
  // are larger; row 2 tiles are smaller (5 across). Kept in one place so
  // responsive tweaks touch one object.
  const preset = size === 'lg'
    ? {numeral: 'clamp(90px, 11vw, 150px)', title: 'clamp(14px, 1.5vw, 22px)', pad: 8}
    : {numeral: 'clamp(70px, 8.5vw, 120px)', title: 'clamp(12px, 1.1vw, 18px)', pad: 6};

  return (
    // The whole card is a link. target=_blank so it opens in a new tab;
    // rel=noopener,noreferrer is a standard security/performance best practice
    // for external links. textDecoration:none kills the default underline;
    // color:inherit keeps internal text colours intact.
    <a href={href || '#'} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,                          // lets the tile shrink inside CSS grid cells
        textDecoration: 'none', color: 'inherit',
      }}>

      {/* Numeral + tile, side-by-side. The parent has a fixed aspect-ratio
          so the row keeps its shape at any viewport width. */}
      <div style={{
        display: 'flex', alignItems: 'center',
        aspectRatio: size === 'lg' ? '4/3' : '3/2.4',
      }}>

        {/* ----- Giant numeral (left column) -------------------------------
            aria-hidden: it's decorative; screen-readers should ignore it.
            flex: '0 0 34%' : fixed 34% of card width so the tile gets 66%.
            textShadow + WebkitTextStroke : subtle lift so the numeral reads
              on both the white page and the patterned body background.
            pointerEvents:none : lets the user click "through" the numeral
              to the underlying link (it overlaps the tile slightly). */}
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
          // Negative margin pulls the italic top-right corner of the digit
          // so it visually "kisses" the left edge of the tile.
          marginRight: -4,
          whiteSpace: 'nowrap',
        }}>{rank}</div>

        {/* ----- Game tile (right column) ----------------------------------
            position:relative is the stacking context for the overlays
              (uploaded image, provider chip, Upload button, × button,
              Min/Max scrim). overflow:hidden clips everything to the
              rounded rectangle. */}
        <div style={{
          flex: '1 1 auto',
          aspectRatio: '1/1',                 // tiles are square
          borderRadius: 8,
          overflow: 'hidden',
          // If the user has uploaded, fill behind is dark so transparent
          // SVGs/PNGs have contrast. Otherwise show the fallback gradient.
          background: userImg ? '#1D1E1B' : art.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(29,30,27,0.22), 0 2px 4px rgba(29,30,27,0.12)',
          position: 'relative',
          transition: 'transform 200ms cubic-bezier(0.2,0,0,1), box-shadow 200ms cubic-bezier(0.2,0,0,1)',
        }}>

          {/* Uploaded artwork. object-fit:contain prevents cropping of
              non-square images; objectPosition:center keeps it centred.
              inset:0 + width/height:100% makes it fill the tile exactly. */}
          {userImg && (
            <img src={userImg} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center',
              display: 'block',
            }}/>
          )}

          {/* Hidden <input type=file>. The visible Upload button below
              programmatically clicks this to open the OS file dialog. */}
          <input ref={fileInputRef} type="file" accept="image/*"
            onChange={handleFile}
            style={{display: 'none'}}
            onClick={e=>e.stopPropagation()}/>

          {/* Fallback wordmark — shown only when there's no uploaded image.
              marginBottom reserves room so the wordmark doesn't collide
              with the Min/Max scrim overlay at the bottom. */}
          {!userImg && (
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

          {/* Provider chip (top-right). Hidden once a user image is shown,
              since the real thumbnail already carries the provider logo. */}
          {!userImg && art.provider && (
            <div style={{
              position: 'absolute', top: 8, right: 10,
              fontSize: 9, fontWeight: 500, letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase',
            }}>{art.provider}</div>
          )}

          {/* Upload / Replace button (top-left). zIndex:3 keeps it above
              the image. stopPropagation + preventDefault stop the click
              from activating the surrounding <a>. Opacity is driven by
              the `hover` state so the button only appears on hover. */}
          <button
            onClick={e=>{
              e.stopPropagation();
              e.preventDefault();
              fileInputRef.current && fileInputRef.current.click();
            }}
            title={userImg ? 'Replace image' : 'Upload image'}
            style={{
              position: 'absolute', top: 8, left: 8, zIndex: 3,
              background: 'rgba(29,30,27,0.82)', color: '#fff', border: 'none',
              borderRadius: 3, padding: '6px 10px',
              fontFamily: 'Roboto', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer',
              opacity: hover ? 1 : 0,
              transition: 'opacity 160ms ease',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {/* Lucide "upload" icon inlined so no icon-font dependency. */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {userImg ? 'Replace' : 'Upload'}
          </button>

          {/* Clear (×) button — only rendered when an image is set, and
              only visible on hover. Same z-index as the upload button. */}
          {userImg && (
            <button onClick={clearImg} title="Remove image" style={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              background: 'rgba(29,30,27,0.82)', color: '#fff', border: 'none',
              borderRadius: 3, width: 24, height: 24,
              display: hover ? 'flex' : 'none',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, lineHeight: 1,
            }}>×</button>
          )}

          {/* Min / Max overlay, pinned to the bottom of the tile.
              A soft dark gradient behind ensures the white text is legible
              over any artwork. Rows are stacked (MIN above MAX) so long
              amounts like "30'000.00" never overflow the tile width. */}
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
                prevents "CHF" from wrapping to a second line on narrow tiles.
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
 * <Top10Rail /> — section wrapper
 * -------------------------------------------------------------------------
 * Renders the heading, then two CSS-grid rows: ranks 1–4 on top (4 columns)
 * and ranks 5–9 on bottom (5 columns). Each cell holds one <Top10Card />.
 * Because the numeral and tile are both inside the card's grid cell, cards
 * can't visually overlap their neighbours.
 * ========================================================================= */
function Top10Rail({ heading = 'TOP 10 MOST POPULAR GAMES' }) {
  return (
    <section style={{padding: '28px 32px'}}>

      {/* Heading + hint line. The hint tells editors the upload feature
          exists and sets expectations that localStorage is per-browser. */}
      <div style={{display: 'flex', alignItems: 'baseline', marginBottom: 18, gap: 12, flexWrap: 'wrap'}}>
        <h2 style={{...displayItalicJP, fontSize: 22, margin: 0, color: INK_JP}}>{heading}</h2>
        <span style={{fontSize: 11, fontWeight: 400, color: '#8C8D89', letterSpacing: '0.04em'}}>
          Hover any tile to upload an image · images are stored locally in your browser
        </span>
      </div>

      {/* Row 1 — ranks 1..4, larger tiles. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',  // 4 equal columns
        gap: 20,
        marginBottom: 28,
      }}>
        {TOP10_GAMES.slice(0, 4).map(g => (
          <Top10Card key={g.rank} {...g} size="lg"/>
        ))}
      </div>

      {/* Row 2 — ranks 5..9, smaller tiles evenly distributed. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
      }}>
        {TOP10_GAMES.slice(4, 9).map(g => (
          <Top10Card key={g.rank} {...g} size="sm"/>
        ))}
      </div>
    </section>
  );
}


/* ---- Expose to other <script type="text/babel"> blocks -------------------
 * The index.html renders <Top10Rail /> from a separate inline script, so
 * we publish it on window. In a bundler (webpack/vite), replace this with
 * `export { Top10Rail, Top10Card, TOP10_GAMES, TOP10_ART };`
 * -------------------------------------------------------------------------- */
Object.assign(window, { Top10Rail, Top10Card, TOP10_GAMES, TOP10_ART });
