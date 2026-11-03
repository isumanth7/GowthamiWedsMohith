import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playMusic } from '../utils/audioPlayer';

export default function Invitation({ opened, onOpen }) {
  const cardRef = useRef(null);
  const triggeredRef = useRef(false);
  const [ribbonGone, setRibbonGone] = useState(false);

  const handleCardClick = () => {
    if (triggeredRef.current || opened) return;
    triggeredRef.current = true;

    // Trigger audio immediately and synchronously in the user gesture call stack (iOS Safari requirement)
    playMusic();
    setRibbonGone(true);
    setTimeout(onOpen, 900);
  };
  const canvasTL = useRef(null);
  const canvasTR = useRef(null);
  const canvasBL = useRef(null);
  const canvasBR = useRef(null);

  // Draw botanical floral corners on canvas
  useEffect(() => {
    const canvases = [
      { ref: canvasTL, seed: 1, flip: false },
      { ref: canvasTR, seed: 2, flip: true },
      { ref: canvasBL, seed: 3, flip: false },
      { ref: canvasBR, seed: 4, flip: true },
    ];

    canvases.forEach(({ ref, seed, flip }) => {
      const cv = ref.current;
      if (!cv) return;
      const W = 110, H = 110;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      if (flip) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      drawFloral(ctx, seed, W, H);
    });
  }, []);

  return (
    <motion.div
      onClick={!opened ? handleCardClick : undefined}
      onTouchEnd={!opened ? handleCardClick : undefined}
      role="button"
      tabIndex={0}
      aria-label="Open wedding invitation"
      style={{ cursor: opened ? 'default' : 'pointer', touchAction: 'manipulation' }}
      className={`invitation-overlay${opened ? ' opened' : ''}`}
      animate={opened ? { opacity: 0, visibility: 'hidden', scale: 1.08 } : {}}
      transition={{ duration: 1.4, ease: [0.3, 0, 0.2, 1] }}
    >
      {/* Card */}
      <div className="inv-card" ref={cardRef}>
        {/* Floral corners */}
        <canvas className="floral-corner sk-tl" ref={canvasTL} />
        <canvas className="floral-corner sk-tr" ref={canvasTR} />
        <canvas className="floral-corner sk-bl" ref={canvasBL} />
        <canvas className="floral-corner sk-br" ref={canvasBR} />

        {/* Sparkle corners */}
        <i className="card-corner c1">✦</i>
        <i className="card-corner c2">✦</i>
        <i className="card-corner c3">✦</i>
        <i className="card-corner c4">✦</i>

        {/* Inner content */}
        <div className="card-content">
          <div className="mono2" style={{ letterSpacing: '0.02em' }}>G&M</div>
          <p className="eyebrow" style={{ color: 'var(--soft)' }}>You are invited</p>

          <div className="names-row">
            <div className={`card-names script${opened ? ' revealed' : ''}`}>
              <span>Gowthami</span>
              <span className="amp">&amp;</span>
              <span>Mohith</span>
            </div>

            {/* Ribbon — on top of names */}
            {!ribbonGone && (
              <div className={`ribbon-wrap${ribbonGone ? ' untying' : ''}`}>
                <div className="ribbon-band" />
                <svg className="bow-svg" viewBox="0 0 240 230" aria-hidden="true">
                  <defs>
                    <linearGradient id="sat" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#b99c60" />
                      <stop offset=".28" stopColor="#f4e5bd" />
                      <stop offset=".5" stopColor="#d6bb82" />
                      <stop offset=".74" stopColor="#fbf0d0" />
                      <stop offset="1" stopColor="#b39556" />
                    </linearGradient>
                    <linearGradient id="sat2" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#b99c60" />
                      <stop offset=".3" stopColor="#f6e8c4" />
                      <stop offset=".55" stopColor="#d4b97e" />
                      <stop offset=".8" stopColor="#fbf0d0" />
                      <stop offset="1" stopColor="#ae9050" />
                    </linearGradient>
                    <linearGradient id="knot" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#e9d6a0" />
                      <stop offset=".5" stopColor="#bfa263" />
                      <stop offset="1" stopColor="#9d8147" />
                    </linearGradient>
                    <filter id="sh" x="-20%" y="-20%" width="140%" height="150%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#46381a" floodOpacity=".35" />
                    </filter>
                  </defs>
                  <g filter="url(#sh)">
                    <g className="tail tl">
                      <path d="M112 112C102 150 88 178 70 214L94 204L104 224C116 186 124 150 128 112Z" fill="url(#sat)" />
                      <path d="M114 118C106 152 96 176 84 200" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" fill="none" />
                    </g>
                    <g className="tail tr">
                      <path d="M128 112C140 150 152 184 176 218L150 206L142 226C128 188 120 150 114 112Z" fill="url(#sat2)" />
                      <path d="M128 118C136 150 146 178 160 204" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" fill="none" />
                    </g>
                    <g className="loop ll">
                      <path d="M120 100C96 30 24 28 16 78C10 120 84 128 120 108Z" fill="url(#sat)" />
                      <path d="M110 98C88 52 44 50 36 80C32 104 78 112 110 104" fill="none" stroke="rgba(120,90,40,.28)" strokeWidth="1.4" />
                      <path d="M104 92C86 62 58 58 44 74" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                    <g className="loop lr">
                      <path d="M120 100C144 30 216 28 224 78C230 120 156 128 120 108Z" fill="url(#sat2)" />
                      <path d="M130 98C152 52 196 50 204 80C208 104 162 112 130 104" fill="none" stroke="rgba(120,90,40,.28)" strokeWidth="1.4" />
                      <path d="M136 92C154 62 182 58 196 74" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                    <g className="kn">
                      <rect x="102" y="86" width="36" height="42" rx="14" fill="url(#knot)" />
                      <path d="M108 94C114 90 126 90 132 94" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      <path d="M108 118C114 122 126 122 132 118" stroke="rgba(70,50,15,.35)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    </g>
                  </g>
                </svg>
              </div>
            )}
          </div>

          <div className="card-orn">
            <i></i>
            <b>✦</b>
            <i></i>
          </div>
          <p className="card-subtitle">Haldi &amp; Wedding Ceremony</p>
        </div>
      </div>

      {/* Tap hint */}
      {!opened && <div className="tap-hint">Tap to open</div>}
    </motion.div>
  );
}

/* ---- Procedural Botanical Canvas Drawing ---- */
function drawFloral(ctx, seed, W, H) {
  function rng(s) {
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  const r = rng(seed * 7919 + 1);
  const PAL = [
    { a: '#d9c79f', b: '#f6ecd4', c: '#fffdf6', e: 'rgba(140,110,60,.28)' },
    { a: '#dcc4cc', b: '#f6ecef', c: '#ffffff', e: 'rgba(120,85,100,.24)' },
  ];
  const p = PAL[seed % 2];
  const sc = 0.72;

  // Draw stems
  ctx.save();
  ctx.strokeStyle = '#8f8a6e';
  ctx.lineWidth = 1.4 * sc;
  ctx.lineCap = 'round';

  const stemX = W * 0.22, stemY = H * 0.82;
  for (let i = 0; i < 3; i++) {
    const ang = -Math.PI / 2 + (r() - 0.5) * 1.4;
    const len = (28 + r() * 22) * sc;
    const ex = stemX + Math.sin(ang) * len + (r() - 0.5) * 8;
    const ey = stemY - Math.cos(ang) * len;
    ctx.beginPath();
    ctx.moveTo(stemX, stemY);
    ctx.quadraticCurveTo(
      stemX + Math.sin(ang) * len * 0.5 + (r() - 0.5) * 6,
      stemY - Math.cos(ang) * len * 0.5,
      ex, ey
    );
    ctx.stroke();

    // Leaves
    for (let k = 0; k < 2; k++) {
      const t = 0.4 + k * 0.3;
      const lx = stemX + Math.sin(ang) * len * t;
      const ly = stemY - Math.cos(ang) * len * t;
      const la = ang + (k % 2 === 0 ? 1 : -1) * (0.7 + r() * 0.3);
      const ll = (14 + r() * 8) * sc;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(la);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(ll * 0.4, -ll * 0.25, ll * 0.4, -ll * 0.75, 0, -ll);
      ctx.bezierCurveTo(-ll * 0.4, -ll * 0.75, -ll * 0.4, -ll * 0.25, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, -ll);
      g.addColorStop(0, '#a3a87a');
      g.addColorStop(1, '#c8cca2');
      ctx.fillStyle = g;
      ctx.shadowColor = 'rgba(40,60,35,.22)';
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.restore();
    }

    // Flower at tip
    drawFlower(ctx, ex, ey, (14 + r() * 8) * sc, p, r);
  }
  ctx.restore();
}

function drawFlower(ctx, cx, cy, R, p, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(r() * Math.PI * 2);
  for (let i = 0; i < 5; i++) {
    const k = i / 4;
    const n = Math.round(7 - k * 3);
    const len = R * (1 - k * 0.6);
    const wid = len * 0.48;
    ctx.shadowBlur = i === 0 ? R * 0.28 : R * 0.07;
    ctx.shadowOffsetY = i === 0 ? R * 0.1 : 0;
    ctx.shadowColor = i === 0 ? 'rgba(60,50,25,.35)' : 'rgba(90,70,35,.25)';
    const off = R * 0.14 * (1 - k);
    for (let j = 0; j < n; j++) {
      ctx.save();
      ctx.rotate(j * (Math.PI * 2) / n + i * 0.62 + (r() - 0.5) * 0.28);
      ctx.translate(0, -off);
      ctx.scale(0.92 + r() * 0.16, 1);
      drawPetal(ctx, len * (0.92 + r() * 0.14), wid, p);
      ctx.restore();
    }
  }
  ctx.shadowColor = 'transparent';
  const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.18);
  cg.addColorStop(0, p.a);
  cg.addColorStop(1, p.b);
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPetal(ctx, len, wid, p) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-wid * 0.95, -len * 0.12, -wid * 1.2, -len * 0.72, -wid * 0.42, -len * 0.97);
  ctx.quadraticCurveTo(-wid * 0.1, -len * 1.03, 0, -len);
  ctx.quadraticCurveTo(wid * 0.1, -len * 1.03, wid * 0.42, -len * 0.97);
  ctx.bezierCurveTo(wid * 1.2, -len * 0.72, wid * 0.95, -len * 0.12, 0, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, 0, -len);
  g.addColorStop(0, p.a);
  g.addColorStop(0.5, p.b);
  g.addColorStop(1, p.c);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = p.e;
  ctx.stroke();
}
