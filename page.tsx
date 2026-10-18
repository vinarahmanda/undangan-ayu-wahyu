'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* =====================================================================
   DATA UNDANGAN  → ubah di sini saja
   ===================================================================== */
const D = {
  bride: 'Ayu Fatimah, A.Md.Kom.',
  groom: 'Wahyu Abdul Rohman, A.Md.Kom.',
  brideShort: 'Ayu',
  groomShort: 'Wahyu',
  brideParents: 'Putri dari Bapak Yayat & Ibu Ratna Ningsih',
  groomParents: 'Putra dari Bapak Anda & Ibu Siti Maesaroh',
  dateDots: '20-21.11.2026',
  place: 'Kp. Cikarmajaya RT02 RW11 Desa Margaasih Kec. Cicalengka Kab. Bandung',
  mapUrl: 'https://maps.google.com',
  rsvpDeadline: '10 November 2026',
  akad: {
    dateText: 'Jumat, 20 November 2026',
    time: '08.00 WIB s.d. selesai', // ← sesuaikan jam akad
    target: '2026-11-20T08:00:00+07:00',
  },
  resepsi: {
    dateText: 'Sabtu, 21 November 2026',
    time: '08.00 WIB s.d. selesai', // ← sesuaikan jam resepsi
    target: '2026-11-21T08:00:00+07:00',
  },
  banks: [{ bank: 'Bank BRI', name: 'Ayu Fatimah', no: '1234567890' }],
  // isi path foto di /public, contoh '/foto/ayu.jpg'. Kosong = siluet
  photos: { bride: '', groom: '', g1: '', g2: '', g3: '', g4: '' },
};

// taruh file lagu di /public/musik/menikah.mp3
const MUSIC_SRC = '/musik/menikah.mpeg';

const C = {
  ink: '#0d1b33',
  denimDeep: '#16294a',
  denim: '#2c4a7c',
  denimSoft: '#8aa6d0',
  cream: '#f7f2e8',
  paper: '#efe6d2',
  gold: '#cdaa5f',
  goldLite: '#ecd9a3',
};

/* =====================================================================
   STYLE GLOBAL
   ===================================================================== */
const damask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='130'%3E%3Cg fill='none' stroke='%23cdaa5f' stroke-opacity='.24' stroke-width='1.2'%3E%3Cpath d='M45 8C32 30 22 42 45 66 68 42 58 30 45 8Z'/%3E%3Cpath d='M45 66C28 78 24 100 45 122 66 100 62 78 45 66Z'/%3E%3Cpath d='M8 66C22 54 30 66 45 66M82 66C68 54 60 66 45 66'/%3E%3Ccircle cx='45' cy='66' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    .f-script{font-family:'Pinyon Script',cursive;font-weight:400}
    .f-serif{font-family:'Cormorant Garamond',Georgia,serif}
    .denim{background-color:${C.denimDeep};
      background-image:
        linear-gradient(115deg,transparent 42%,rgba(255,255,255,.09) 50%,transparent 58%),
        linear-gradient(135deg,rgba(255,255,255,.04) 25%,transparent 25% 50%,rgba(255,255,255,.04) 50% 75%,transparent 75%),
        repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px);
      background-size:260% 100%,60px 60px,auto;animation:denimrun 7s linear infinite}
    .curtain{background:
      linear-gradient(115deg,transparent 42%,rgba(255,255,255,.1) 50%,transparent 58%),
      linear-gradient(180deg,rgba(13,27,51,.55),transparent 25%,transparent 75%,rgba(13,27,51,.7)),
      repeating-linear-gradient(90deg,#1b3a6b 0,#3a5f9c 24px,#1b3a6b 48px,#122648 72px);
      background-size:260% 100%,100% 100%,72px 100%;animation:curtainrun 6s linear infinite}
    .damask{background-color:${C.ink};background-image:${damask};animation:drift 14s linear infinite}
    @keyframes denimrun{from{background-position:0% 0,0 0,0 0}to{background-position:100% 0,60px 0,0 0}}
    @keyframes curtainrun{from{background-position:0% 0,0 0,0 0}to{background-position:100% 0,0 0,72px 0}}
    @keyframes drift{to{background-position:90px 130px}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .vinyl{animation:spin 6s linear infinite;animation-play-state:paused}
    .vinyl.on{animation-play-state:running}
    .lace{height:26px;background:radial-gradient(circle at 13px 0,transparent 8px,${C.cream} 8.5px,${C.cream} 11px,transparent 11.5px) 0 0/26px 26px repeat-x}
    .shine{background:linear-gradient(110deg,${C.gold},${C.goldLite} 40%,${C.gold} 60%,#a98838)}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}
  `}</style>
);

/* =====================================================================
   ORNAMEN SVG
   ===================================================================== */
const Butterfly = ({ size = 40, className = '', tone = 'white' }: { size?: number; className?: string; tone?: 'white' | 'blue' }) => {
  const c1 = tone === 'white' ? '#ffffff' : '#d6e4ff';
  const c2 = tone === 'white' ? '#cfdcf2' : '#6f93cc';
  const wings = (
    <>
      <path d="M30 24C26 6 6 0 3 14 1 24 16 30 30 25Z" fill={`url(#wg-${tone})`} stroke={C.gold} strokeWidth=".6" />
      <path d="M30 26C20 28 10 38 17 45 24 49 30 38 30 26Z" fill={`url(#wg-${tone})`} stroke={C.gold} strokeWidth=".6" />
      <path d="M30 25C22 20 12 16 6 12M30 26C24 30 20 36 18 42" stroke={C.gold} strokeWidth=".5" strokeOpacity=".7" fill="none" />
      <circle cx="14" cy="14" r="2.2" fill={C.gold} fillOpacity=".85" />
      <circle cx="20" cy="40" r="1.5" fill={C.gold} fillOpacity=".85" />
    </>
  );
  return (
    <motion.svg viewBox="0 0 60 50" width={size} height={size * 0.83} className={className}
      animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 7px rgba(255,248,220,.85))' }}>
      <defs>
        <radialGradient id={`wg-${tone}`} cx="30%" cy="40%">
          <stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} />
        </radialGradient>
      </defs>
      <motion.g style={{ transformOrigin: '30px 25px' }} animate={{ scaleX: [1, 0.35, 1] }} transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}>
        {wings}
        <g transform="translate(60 0) scale(-1 1)">{wings}</g>
      </motion.g>
      <ellipse cx="30" cy="26" rx="1.5" ry="8" fill="#5b4a2a" />
      <path d="M30 18C28 12 25 10 23 9M30 18C32 12 35 10 37 9" stroke="#5b4a2a" strokeWidth=".8" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
};

const Bloom = ({ size = 90, tone = 'white', className = '' }: { size?: number; tone?: 'white' | 'denim'; className?: string }) => {
  const petal = tone === 'white' ? '#fbf7ee' : C.denimSoft;
  const edge = tone === 'white' ? '#d9cfb6' : '#5b7db3';
  return (
    <motion.svg viewBox="-50 -50 100 100" width={size} height={size} className={className}
      animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 5 + (size % 4), ease: 'easeInOut' }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="0" cy="-24" rx="13" ry="22" fill={petal} stroke={edge} strokeWidth=".8" transform={`rotate(${a})`} />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => (
        <ellipse key={a} cx="0" cy="-12" rx="8" ry="13" fill={petal} stroke={edge} strokeWidth=".6" opacity=".9" transform={`rotate(${a})`} />
      ))}
      <circle r="6" fill={C.gold} />
      <circle r="2.5" fill="#a98838" />
    </motion.svg>
  );
};

const Leaf = ({ className = '', flip = false }: { className?: string; flip?: boolean }) => (
  <motion.svg viewBox="0 0 40 120" className={className}
    style={{ scaleX: flip ? -1 : 1, transformOrigin: '50% 100%' }}
    animate={{ rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
    <path d="M20 118C20 80 22 40 20 4" stroke="#8aa6d0" strokeWidth="1.2" fill="none" />
    {[16, 34, 52, 70, 88].map((y, i) => (
      <g key={y}>
        <path d={`M20 ${y + 12}C${6 + i} ${y + 4} 4 ${y - 8} 8 ${y - 14}C16 ${y - 8} 20 ${y} 20 ${y + 12}Z`} fill="#3d5f94" opacity=".85" />
        <path d={`M20 ${y + 12}C${34 - i} ${y + 4} 36 ${y - 8} 32 ${y - 14}C24 ${y - 8} 20 ${y} 20 ${y + 12}Z`} fill="#4a72ad" opacity=".85" />
      </g>
    ))}
  </motion.svg>
);

/* gelas (resepsi) */
const Glasses = () => (
  <svg viewBox="0 0 120 80" width="86" fill="none" stroke={C.goldLite} strokeWidth="1.6" strokeLinecap="round">
    <path d="M30 8l-8 28c-2 10 12 14 14 4l6-32z" transform="rotate(-8 40 30)" />
    <path d="M32 40v30M22 72h20" transform="rotate(-8 32 55)" />
    <path d="M86 8l8 28c2 10-12 14-14 4l-6-32z" transform="rotate(8 80 30)" />
    <path d="M88 40v30M78 72h20" transform="rotate(8 88 55)" />
    <path d="M56 38c4-6 10-6 8 0-3 7-8 4-8 0zM64 38c6-6 12-4 8 2" />
  </svg>
);

/* cincin (akad) */
const Rings = () => (
  <svg viewBox="0 0 120 70" width="86" fill="none" stroke={C.goldLite} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="44" cy="42" r="20" />
    <circle cx="76" cy="42" r="20" />
    <path d="M70 12l6-8 6 8-6 8z" fill={C.goldLite} fillOpacity=".3" />
  </svg>
);

const Silhouette = ({ gender }: { gender: 'f' | 'm' }) => (
  <svg viewBox="0 0 100 120" className="w-full h-full" style={{ background: `linear-gradient(180deg,${C.denim},${C.denimDeep})` }}>
    <circle cx="50" cy="42" r="17" fill={C.denimSoft} opacity=".55" />
    <path d={gender === 'f' ? 'M16 120c0-34 14-46 34-46s34 12 34 46z' : 'M12 120c0-30 16-44 38-44s38 14 38 44z'} fill={C.denimSoft} opacity=".4" />
    {gender === 'f' && <path d="M32 40c0-24 36-24 36 0-4-10-32-10-36 0z" fill={C.cream} opacity=".5" />}
  </svg>
);

const OvalFrame = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`relative mx-auto ${className}`} style={{ aspectRatio: '3 / 3.9' }}>
    <svg viewBox="0 0 300 390" className="absolute inset-0 w-full h-full" fill="none">
      <ellipse cx="150" cy="200" rx="138" ry="176" fill={C.denimDeep} fillOpacity=".92" />
      <ellipse cx="150" cy="200" rx="138" ry="176" stroke={C.cream} strokeWidth="2" />
      <ellipse cx="150" cy="200" rx="128" ry="166" stroke={C.cream} strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
      <ellipse cx="150" cy="200" rx="118" ry="156" stroke={C.cream} strokeOpacity=".45" strokeWidth=".8" />
      <g stroke={C.cream} strokeWidth="1.6" strokeLinecap="round">
        <path d="M150 6c-8 10-8 18 0 24 8-6 8-14 0-24z" fill={C.cream} fillOpacity=".25" />
        <path d="M150 30c-16-2-26-12-38-12M150 30c16-2 26-12 38-12" />
        <path d="M112 18c-10-4-18 4-12 10M188 18c10-4 18 4 12 10" />
        <path d="M150 370c-8-10-8-18 0-24 8 6 8 14 0 24z" fill={C.cream} fillOpacity=".25" />
        <path d="M150 346c-16 2-26 12-38 12M150 346c16 2 26 12 38 12" />
        <path d="M14 170c10 6 12 18 4 26 8 8 6 20-4 26" />
        <path d="M286 170c-10 6-12 18-4 26-8 8-6 20 4 26" />
        <path d="M44 84c10-6 18-16 22-28M256 84c-10-6-18-16-22-28M44 316c10 6 18 16 22 28M256 316c-10 6-18 16-22 28" />
      </g>
    </svg>
    <div className="absolute inset-[12%] flex flex-col items-center justify-center text-center text-[#f7f2e8]">{children}</div>
  </div>
);

const GoldFrame = ({ src, shape = 'oval', gender = 'f', className = '' }: { src?: string; shape?: 'oval' | 'rect'; gender?: 'f' | 'm'; className?: string }) => (
  <div className={`shine p-[7px] shadow-[0_12px_30px_rgba(0,0,0,.55)] ${className}`} style={{ borderRadius: shape === 'oval' ? '50%' : 12 }}>
    <div className="p-[3px] bg-[#0d1b33]" style={{ borderRadius: shape === 'oval' ? '50%' : 8 }}>
      <div className="overflow-hidden w-full h-full" style={{ borderRadius: shape === 'oval' ? '50%' : 6, aspectRatio: shape === 'oval' ? '3/4' : '4/5' }}>
        {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <Silhouette gender={gender} />}
      </div>
    </div>
  </div>
);

const Envelope = ({ opened }: { opened: boolean }) => (
  <div className="relative mx-auto" style={{ width: 270, height: 190, perspective: 800 }}>
    <svg viewBox="0 0 270 190" className="absolute inset-0 drop-shadow-[0_16px_28px_rgba(0,0,0,.55)]">
      <defs>
        <pattern id="lacep" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="4" fill="none" stroke="#f7f2e8" strokeOpacity=".35" />
          <circle cx="9" cy="9" r="1" fill="#f7f2e8" fillOpacity=".5" />
        </pattern>
      </defs>
      <rect x="2" y="2" width="266" height="186" rx="6" fill={C.denim} />
      <rect x="2" y="2" width="266" height="186" rx="6" fill="url(#lacep)" />
      <path d="M2 188L135 100 268 188" stroke={C.cream} strokeOpacity=".5" fill="none" />
      <rect x="2" y="2" width="266" height="186" rx="6" fill="none" stroke={C.cream} strokeOpacity=".7" strokeDasharray="1 4" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
    <motion.div className="absolute left-0 top-0 w-full" style={{ transformOrigin: 'top', height: 110 }} animate={{ rotateX: opened ? 180 : 0 }} transition={{ duration: 0.9 }}>
      <svg viewBox="0 0 270 110" className="w-full h-full">
        <path d="M2 4L135 106 268 4Z" fill={C.denimDeep} stroke={C.cream} strokeOpacity=".7" strokeDasharray="1 4" strokeLinecap="round" strokeWidth="1.6" />
        <path d="M2 4L135 106 268 4Z" fill="url(#lacep)" />
      </svg>
    </motion.div>
    <div className="absolute left-1/2 top-[88px] -translate-x-1/2 h-14 w-14 rounded-full shine flex items-center justify-center shadow-lg">
      <svg viewBox="-20 -20 40 40" width="38">
        <circle r="9" fill="none" stroke="#7a5f1f" strokeWidth="1.4" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d="M0 -11L2 -16 0 -19-2 -16Z" fill="#7a5f1f" transform={`rotate(${a})`} />
        ))}
        <circle r="3" fill="#7a5f1f" />
      </svg>
    </div>
  </div>
);

/* =====================================================================
   DEKORASI PER SECTION
   Yang melayang hanya kupu-kupu & bunga (di pinggir, tidak menutupi tulisan)
   ===================================================================== */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const edgeX = (i: number, k: number) => (rnd(i, k) < 0.5 ? rnd(i, k + 1) * 14 : 86 + rnd(i, k + 1) * 12);
const useMounted = () => {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
};

/* lampu gantung kristal (chandelier) */
const Chandelier = () => {
  const cands = [{ x: 20, y: 60 }, { x: 48, y: 52 }, { x: 80, y: 40 }, { x: 112, y: 52 }, { x: 140, y: 60 }];
  const drops = Array.from({ length: 9 }, (_, k) => {
    const t = (k + 1) / 10;
    return {
      x: (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 80 + t * t * 140,
      y: (1 - t) ** 2 * 72 + 2 * (1 - t) * t * 114 + t * t * 72,
      big: k === 4,
    };
  });
  return (
    <div className="absolute inset-x-0 top-0 flex justify-center">
      <motion.svg viewBox="0 0 160 150" width={150} height={141} style={{ transformOrigin: '50% 0%', overflow: 'visible' }}
        animate={{ rotate: [-2.5, 2.5, -2.5] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <defs>
          <linearGradient id="chg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dfa2" /><stop offset=".5" stopColor="#cdaa5f" /><stop offset="1" stopColor="#8f7430" />
          </linearGradient>
          <radialGradient id="chglow"><stop offset="0" stopColor="#ffe9a8" stopOpacity=".9" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
          <linearGradient id="chcr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#a9c3ec" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((k) => <ellipse key={k} cx="80" cy={4 + k * 7} rx="2.6" ry="4" fill="none" stroke="url(#chg)" strokeWidth="1.4" />)}
        <path d="M70 0Q80 -3 90 0L86 6H74Z" fill="url(#chg)" />
        <path d="M80 30V44" stroke="url(#chg)" strokeWidth="3" />
        <path d="M71 44Q80 38 89 44L92 58Q80 70 68 58Z" fill="url(#chg)" stroke="#8f7430" strokeWidth=".6" />
        <circle cx="80" cy="74" r="4" fill="url(#chg)" />
        <g stroke="url(#chg)" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M70 56C54 58 52 58 48 56" /><path d="M90 56C106 58 108 58 112 56" />
          <path d="M72 62C52 70 26 72 20 64" /><path d="M88 62C108 70 134 72 140 64" />
          <path d="M20 72Q80 114 140 72" strokeWidth="1.2" strokeDasharray="1.5 3" />
        </g>
        {cands.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y})`}>
            <motion.circle cy="-17" r="11" fill="url(#chglow)" animate={{ opacity: [0.5, 1, 0.6, 0.95, 0.5] }} transition={{ duration: 1.6 + i * 0.2, repeat: Infinity }} />
            <rect x="-2.6" y="-13" width="5.2" height="13" rx="1" fill="#f7f2e8" />
            <path d="M-5.5 0H5.5L3.5 5H-3.5Z" fill="url(#chg)" />
            <motion.ellipse cy="-17" rx="2.2" ry="4" fill="#ffd978" style={{ transformOrigin: '50% 100%' }}
              animate={{ scaleY: [1, 1.3, 0.85, 1.2, 1], scaleX: [1, 0.85, 1.1, 0.9, 1] }} transition={{ duration: 1.1 + i * 0.13, repeat: Infinity, ease: 'easeInOut' }} />
            <ellipse cy="-16" rx=".9" ry="2" fill="#fff6d6" />
          </g>
        ))}
        {drops.map((d, i) => (
          <motion.g key={i} style={{ transformOrigin: `${d.x}px ${d.y}px` }}
            animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3 + (i % 3) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}>
            <line x1={d.x} y1={d.y} x2={d.x} y2={d.y + (d.big ? 14 : 8)} stroke="url(#chg)" strokeWidth=".9" />
            <motion.path d="M0 0C-5 6 -5 12 0 16 5 12 5 6 0 0Z" transform={`translate(${d.x} ${d.y + (d.big ? 14 : 8)}) scale(${d.big ? 1.5 : 1})`}
              fill="url(#chcr)" stroke={C.gold} strokeWidth=".5"
              animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }} />
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
};

/* rangkaian bunga menggantung yang berayun */
const HangingVine = ({ side, len = 150, delay = 0 }: { side: 'left' | 'right'; len?: number; delay?: number }) => (
  <motion.svg viewBox="0 0 40 160" width={34} height={len} className="absolute top-0"
    style={{ ...(side === 'left' ? { left: 6 } : { right: 6 }), transformOrigin: '50% 0%' }}
    animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay: -delay }}>
    <path d="M20 0C14 36 26 72 18 112C14 134 20 146 20 156" stroke="#7fa2d4" strokeWidth="1.2" fill="none" />
    {[20, 44, 68, 92, 116].map((y, i) => {
      const cx = i % 2 ? 28 : 10;
      return <ellipse key={y} cx={cx} cy={y} rx="7" ry="3.2" transform={`rotate(${i % 2 ? -35 : 35} ${cx} ${y})`} fill={i % 2 ? '#4a72ad' : '#3d5f94'} />;
    })}
    <circle cx="26" cy="70" r="3.2" fill="#fbf7ee" /><circle cx="12" cy="104" r="3" fill="#fbf7ee" />
    <circle cx="20" cy="148" r="6" fill="#fbf7ee" stroke="#d9cfb6" strokeWidth=".6" /><circle cx="20" cy="148" r="2.4" fill={C.gold} />
  </motion.svg>
);

type DecorProps = { seed?: number; butterflies?: number; blooms?: number; chandelier?: boolean; vines?: boolean; curtains?: boolean; rays?: boolean };

const Decor = ({ seed = 0, butterflies = 2, blooms = 1, chandelier = false, vines = true, curtains = false, rays = false }: DecorProps) => {
  const reduce = useReducedMotion();
  const mounted = useMounted(); // render hanya di client → tidak ada hydration mismatch
  if (!mounted || reduce) return null;
  const s = (i: number) => i + seed * 50;
  const r = (i: number, k: number) => rnd(s(i), k);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {rays && (
        <motion.div className="absolute -left-[25%] -top-[8%] h-[70%] w-[150%]" style={{ transformOrigin: '50% 0%', background: 'repeating-conic-gradient(from 160deg at 50% 0%, rgba(255,240,200,.09) 0 5deg, transparent 5deg 14deg)', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent 85%)', maskImage: 'linear-gradient(180deg,#000,transparent 85%)' }}
          animate={{ rotate: [-5, 5, -5], opacity: [0.5, 1, 0.5] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      )}
      {curtains && (['left', 'right'] as const).map((side) => (
        <motion.div key={side} className="absolute top-0 h-full w-[13%]"
          style={{ ...(side === 'left' ? { left: 0 } : { right: 0 }), transformOrigin: `${side} top`,
            background: 'repeating-linear-gradient(90deg,#0f2142 0,#2c4a7c 7px,#0f2142 14px)',
            WebkitMaskImage: `linear-gradient(${side === 'left' ? 90 : 270}deg,#000 45%,transparent)`,
            maskImage: `linear-gradient(${side === 'left' ? 90 : 270}deg,#000 45%,transparent)` }}
          animate={{ scaleX: [1, 1.2, 1], skewY: [0, side === 'left' ? 1.2 : -1.2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
      {chandelier && <Chandelier />}
      {vines && (<><HangingVine side="left" len={150} /><HangingVine side="right" len={125} delay={1.5} /></>)}

      {/* bunga melayang naik pelan */}
      {Array.from({ length: blooms }).map((_, i) => (
        <motion.div key={`d${i}`} className="absolute" style={{ left: `${edgeX(s(i), 51)}%`, bottom: -70 }}
          animate={{ y: [0, -620], x: [0, 18, -14, 10], rotate: [0, 160], opacity: [0, 0.95, 0.95, 0] }}
          transition={{ duration: 20 + r(i, 52) * 10, repeat: Infinity, ease: 'linear', delay: -r(i, 53) * 18 }}>
          <Bloom size={30} tone={(i + seed) % 2 ? 'denim' : 'white'} />
        </motion.div>
      ))}

      {/* kupu-kupu terbang melengkung */}
      {Array.from({ length: butterflies }).map((_, i) => {
        const l = edgeX(s(i), 41);
        const dir = l < 50 ? 1 : -1;
        return (
          <motion.div key={`b${i}`} className="absolute" style={{ left: `${l}%`, top: '4%' }}
            animate={{ x: [0, 34 * dir, -6 * dir, 42 * dir, 10 * dir, 0], y: [0, 130, 70, 290, 170, 0], rotate: [-10, 8, -6, 12, -8, -10] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'easeInOut', delay: -i * 6 }}>
            <Butterfly size={30 + ((i + seed) % 3) * 8} tone={i % 2 ? 'blue' : 'white'} />
          </motion.div>
        );
      })}
    </div>
  );
};

const Section = ({ children, curtain = false, damaskBg = false, seed = 0, className = '', decor = {} }: { children: ReactNode; curtain?: boolean; damaskBg?: boolean; seed?: number; className?: string; decor?: object }) => (
  <section className={`relative overflow-hidden px-7 py-16 ${curtain ? 'curtain pt-32' : damaskBg ? 'damask' : 'denim'} ${className}`}>
    <Decor seed={seed} chandelier={curtain} rays={curtain} curtains={damaskBg} {...decor} />
    <div className="relative z-10">{children}</div>
  </section>
);

/* popup saat scroll */
const Reveal = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 40 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ type: 'spring', stiffness: 130, damping: 14, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Title = ({ children }: { children: ReactNode }) => (
  <h2 className="f-script text-[44px] leading-tight text-[#f7f2e8]">{children}</h2>
);

/* =====================================================================
   COUNTDOWN (big = resepsi, small = akad)
   ===================================================================== */
const useCountdown = (target: string) => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, +new Date(target) - Date.now());
      setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
};

const Countdown = ({ target, small = false }: { target: string; small?: boolean }) => {
  const t = useCountdown(target);
  return (
    <div className={`grid grid-cols-4 ${small ? 'gap-2 mx-auto max-w-[230px]' : 'gap-3'}`}>
      {([['Hari', t.d], ['Jam', t.h], ['Menit', t.m], ['Detik', t.s]] as const).map(([l, v]) => (
        <div key={l} className={`border border-[#cdaa5f]/60 bg-[#0d1b33]/80 text-center ${small ? 'rounded-lg py-1.5' : 'rounded-t-full rounded-b-lg pt-4 pb-2'}`}>
          <div className={`f-serif font-semibold tabular-nums text-[#f7f2e8] ${small ? 'text-base' : 'text-3xl'}`}>{String(v).padStart(2, '0')}</div>
          <div className={`f-serif italic text-[#8aa6d0] ${small ? 'text-[10px]' : 'text-xs'}`}>{l}</div>
        </div>
      ))}
    </div>
  );
};

/* =====================================================================
   MUSIK (otomatis diputar saat surat dibuka, berulang)
   ===================================================================== */
const useMusic = (src: string) => {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.preload = 'auto';
    ref.current = a;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    a.addEventListener('play', on);
    a.addEventListener('pause', off);
    return () => {
      a.pause();
      a.removeEventListener('play', on);
      a.removeEventListener('pause', off);
    };
  }, [src]);
  const play = () => ref.current?.play().catch(() => {});
  const toggle = () => { const a = ref.current; if (a) (a.paused ? play() : a.pause()); };
  return { playing, play, toggle };
};

const Vinyl = ({ size = 60, on }: { size?: number; on: boolean }) => (
  <svg viewBox="-50 -50 100 100" width={size} height={size} className={`vinyl ${on ? 'on' : ''}`}>
    <circle r="48" fill="#0a1220" stroke={C.gold} strokeWidth="1.5" />
    {[40, 34, 28, 22].map((r) => <circle key={r} r={r} fill="none" stroke={C.denimSoft} strokeOpacity=".28" />)}
    <path d="M-30 -22A38 38 0 0 1 10 -37" stroke="#fff" strokeOpacity=".25" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle r="15" fill={C.denim} stroke={C.goldLite} />
    <path d="M0 -8c3 3 6 3 6 8s-3 6-6 8c-3-2-6-3-6-8s3-5 6-8z" fill={C.goldLite} fillOpacity=".8" />
    <circle r="2" fill={C.ink} />
  </svg>
);

/* =====================================================================
   DAFTAR TAMU (pagination)
   ===================================================================== */
type Guest = { nama: string; hadir: string; jumlah: number; ucapan: string; waktu: number };
const PER_PAGE = 4;

const GuestList = ({ guests }: { guests: Guest[] }) => {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(guests.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const rows = guests.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const hadir = guests.filter((g) => g.hadir.startsWith('Ya')).reduce((n, g) => n + g.jumlah, 0);
  return (
    <div className="text-[#16294a]">
      <p className="text-center text-[15px]"><span className="f-script text-3xl">{hadir}</span> tamu akan hadir · {guests.length} konfirmasi</p>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="py-6 text-center italic text-[#16294a]/70">Belum ada konfirmasi. Jadilah yang pertama.</p>}
        <AnimatePresence mode="wait">
          <motion.div key={cur} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-3">
            {rows.map((g, i) => (
              <div key={g.waktu + '-' + i} className="rounded-xl border border-[#cdaa5f]/60 bg-[#fbf7ee] p-3.5 shadow">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-base font-semibold">{g.nama}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${g.hadir.startsWith('Ya') ? 'bg-[#16294a] text-[#f7f2e8]' : 'bg-[#d9cfb6] text-[#16294a]'}`}>
                    {g.hadir.startsWith('Ya') ? `Hadir · ${g.jumlah} orang` : 'Berhalangan'}
                  </span>
                </div>
                {g.ucapan && <p className="mt-1.5 text-[15px] italic leading-6 text-[#16294a]/85">“{g.ucapan}”</p>}
                <p className="mt-1 text-xs text-[#16294a]/55">{new Date(g.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="h-9 w-9 rounded-full border border-[#cdaa5f] disabled:opacity-30" aria-label="Halaman sebelumnya">‹</button>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-semibold transition ${cur === i + 1 ? 'bg-[#16294a] text-[#f7f2e8]' : 'border border-[#cdaa5f]'}`}>{i + 1}</button>
          ))}
          <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="h-9 w-9 rounded-full border border-[#cdaa5f] disabled:opacity-30" aria-label="Halaman berikutnya">›</button>
        </div>
      )}
    </div>
  );
};

/* =====================================================================
   HALAMAN UTAMA
   ===================================================================== */
export default function UndanganAyuWahyu() {
  const [isOpen, setIsOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [guest, setGuest] = useState('Bapak/Ibu/Saudara/i');
  const [form, setForm] = useState({ nama: '', hadir: 'Ya, Saya akan Datang', jumlah: 1, ucapan: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const music = useMusic(MUSIC_SRC);

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('to'); // ?to=Budi
    if (to) setGuest(to);
    fetch('/api/rsvp')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Guest[]) => setGuests(d))
      .catch(() => {
        try { setGuests(JSON.parse(localStorage.getItem('rsvp') || '[]')); } catch { /* abaikan */ }
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const openInvitation = () => {
    setOpening(true);
    music.play(); // lagu langsung diputar saat surat dibuka (syarat browser: harus dari klik)
    setTimeout(() => { setIsOpen(true); window.scrollTo(0, 0); }, 1100);
  };

  const copy = (no: string) => {
    navigator.clipboard?.writeText(no);
    setCopied(no);
    setTimeout(() => setCopied(null), 2000);
  };

  const submitRsvp = async () => {
    if (!form.nama.trim()) return;
    setSending(true);
    const item: Guest = { ...form, nama: form.nama.trim(), jumlah: Math.max(1, form.jumlah || 1), waktu: Date.now() };
    try {
      const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
      if (!r.ok) throw new Error();
    } catch {
      try { localStorage.setItem('rsvp', JSON.stringify([item, ...guests])); } catch { /* abaikan */ }
    }
    setGuests([item, ...guests]);
    setSending(false);
    setDone(true);
  };

  const inputCls = 'w-full rounded-md border border-[#cdaa5f]/60 bg-[#fbf7ee] px-3 py-2.5 f-serif text-base text-[#16294a] outline-none focus:border-[#2c4a7c]';

  return (
    <div className="min-h-screen bg-[#0d1b33] f-serif text-[#f7f2e8]">
      <GlobalStyle />

      {/* ================= COVER ================= */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div key="cover" exit={{ opacity: 0, transition: { duration: 0.9 } }} className="fixed inset-0 z-50 curtain overflow-y-auto">
            <div className="relative min-h-full overflow-hidden">
              <Decor seed={9} chandelier rays butterflies={2} blooms={1} />
              <div className="relative z-10 mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-6 pb-10 pt-36 text-center">
                <Bloom size={110} className="absolute -top-6 -left-10" />
                <Bloom size={80} tone="denim" className="absolute top-24 -left-8" />
                <Bloom size={110} className="absolute -bottom-6 -right-10" />
                <Leaf className="absolute bottom-10 right-12 w-8 h-24" flip />
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }} className="text-sm tracking-[0.25em] text-[#ecd9a3]">
                  Wilujeng Sumping
                </motion.p>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1.2 }} className="f-script text-[56px] leading-[1.05] mt-3 mb-8 drop-shadow-lg">
                  {D.brideShort} <span className="text-[#ecd9a3]">&</span> {D.groomShort}
                </motion.h1>
                <motion.div animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                  <Envelope opened={opening} />
                </motion.div>
                <p className="mt-8 text-sm text-[#cfdcf1]">Kepada Yth.</p>
                <p className="f-script text-3xl mt-1">{guest}</p>
                <button onClick={openInvitation} className="mt-7 rounded-full border border-[#ecd9a3] bg-[#f7f2e8] px-9 py-3 text-lg font-semibold text-[#16294a] shadow-xl active:scale-95 transition">
                  Buka Undangan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ISI ================= */}
      {isOpen && (
        <main className="relative mx-auto max-w-md shadow-[0_0_60px_rgba(0,0,0,.7)]">
          {/* piringan hitam berputar di sudut (tombol putar/jeda) */}
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-5">
            <button onClick={music.toggle} aria-label={music.playing ? 'Jeda lagu' : 'Putar lagu'}
              className="pointer-events-auto relative ml-auto block rounded-full shadow-[0_6px_20px_rgba(0,0,0,.6)] ring-2 ring-[#cdaa5f]/70">
              <Vinyl size={52} on={music.playing} />
            </button>
          </div>

          {/* HERO */}
          <section className="curtain relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
            <Decor seed={1} chandelier rays butterflies={2} blooms={1} />
            <div className="absolute inset-x-5 top-6 bottom-6 rounded-t-[200px] rounded-b-2xl border-[10px] border-[#cdaa5f]/70 bg-gradient-to-b from-[#16294a]/60 to-[#0d1b33]/90" />
            <div className="absolute inset-x-8 top-9 bottom-9 rounded-t-[190px] rounded-b-xl border border-[#f7f2e8]/40" />
            <Bloom size={110} className="absolute bottom-10 -right-6" />
            <Bloom size={90} className="absolute bottom-10 -left-6" />
            <Leaf className="absolute bottom-12 right-16 w-8 h-24" flip />
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }} className="relative z-10">
              <p className="text-sm tracking-[0.3em] text-[#ecd9a3]">Undangan Pernikahan</p>
              <h1 className="f-script text-[58px] leading-[1.05] mt-5">
                {D.brideShort}
                <span className="block text-[#ecd9a3] text-4xl">&</span>
                {D.groomShort}
              </h1>
              <p className="text-xl tracking-[0.3em] mt-6">{D.dateDots}</p>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-14 text-xs italic text-[#8aa6d0]">
                gulir ke bawah
                <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-[#cdaa5f] to-transparent" />
              </motion.div>
            </motion.div>
          </section>

          {/* SALAM */}
          <Section damaskBg seed={2}>
            <Reveal className="relative mx-auto max-w-[320px] rounded-sm bg-[#f7f2e8] px-6 py-10 text-center text-[#16294a] shadow-2xl">
              <Leaf className="absolute -left-4 -top-6 w-10 h-28" />
              <Bloom size={70} className="absolute -right-6 -top-6" />
              <p className="f-serif text-2xl" style={{ direction: 'rtl' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              <p className="mt-4 text-[15px] font-semibold">Assalamu’alaikum Warahmatullahi Wabarakatuh</p>
              <p className="mt-4 text-[15px] leading-7">
                Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12 text-center">
              <p className="text-sm tracking-[0.25em] text-[#ecd9a3]">Pernikahan</p>
              <h2 className="f-script text-5xl mt-3">{D.brideShort} & {D.groomShort}</h2>
            </Reveal>
          </Section>

          {/* AR-RUM */}
          <Section curtain seed={3}>
            <Reveal>
              <OvalFrame className="w-[88%]">
                <p className="text-[15px] leading-[1.55]">
                  “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang.”
                </p>
                <p className="mt-3 text-sm font-semibold text-[#ecd9a3]">QS. Ar-Rum: 21</p>
              </OvalFrame>
            </Reveal>
          </Section>

          {/* MEMPELAI */}
          <Section damaskBg seed={4}>
            <Reveal className="text-center"><Title>Mempelai</Title></Reveal>
            <Reveal className="mt-8">
              <div className="relative mx-auto w-[72%]">
                <Bloom size={80} className="absolute -left-8 -bottom-4 z-10" />
                <GoldFrame src={D.photos.bride} gender="f" />
              </div>
              <h3 className="f-script text-[34px] mt-6 text-center leading-tight">{D.bride}</h3>
              <p className="text-center text-[15px] text-[#cfdcf1] mt-2">{D.brideParents}</p>
            </Reveal>
            <Reveal className="text-center my-8"><span className="f-script text-6xl text-[#ecd9a3]">&</span></Reveal>
            <Reveal>
              <div className="relative mx-auto w-[72%]">
                <Bloom size={80} tone="denim" className="absolute -right-8 -bottom-4 z-10" />
                <GoldFrame src={D.photos.groom} gender="m" />
              </div>
              <h3 className="f-script text-[34px] mt-6 text-center leading-tight">{D.groom}</h3>
              <p className="text-center text-[15px] text-[#cfdcf1] mt-2">{D.groomParents}</p>
            </Reveal>
          </Section>

          {/* POTRET */}
          <Section curtain seed={5}>
            <Reveal className="text-center"><Title>Potret Kami</Title></Reveal>
            <div className="mt-8 grid grid-cols-2 items-center gap-5">
              <Reveal><GoldFrame src={D.photos.g1} shape="rect" gender="f" /></Reveal>
              <Reveal delay={0.15}><GoldFrame src={D.photos.g2} gender="m" /></Reveal>
              <Reveal><GoldFrame src={D.photos.g3} gender="f" /></Reveal>
              <Reveal delay={0.15}><GoldFrame src={D.photos.g4} shape="rect" gender="m" /></Reveal>
            </div>
          </Section>

          {/* AKAD */}
          <Section damaskBg seed={6}>
            <Reveal className="text-center"><Title>Akad Nikah</Title></Reveal>
            <Reveal className="mt-8">
              <OvalFrame className="w-[88%]">
                <Rings />
                <h3 className="f-script text-[46px] leading-none mt-1">Akad</h3>
                <p className="mt-3 text-[15px] text-[#ecd9a3]">{D.akad.dateText}</p>
                <p className="text-[15px] font-semibold tracking-wide">{D.akad.time}</p>
                <p className="mt-3 px-2 text-[14px] font-semibold leading-snug">{D.place}</p>
                <a href={D.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-[15px] underline underline-offset-4 decoration-[#ecd9a3]">Lihat Peta</a>
              </OvalFrame>
            </Reveal>
          </Section>

          {/* RESEPSI */}
          <Section curtain seed={7}>
            <Reveal className="text-center"><Title>Resepsi Pernikahan</Title></Reveal>
            <Reveal className="mt-8">
              <OvalFrame className="w-[88%]">
                <Glasses />
                <h3 className="f-script text-[46px] leading-none mt-1">Resepsi</h3>
                <p className="mt-3 text-[15px] text-[#ecd9a3]">{D.resepsi.dateText}</p>
                <p className="text-[15px] font-semibold tracking-wide">{D.resepsi.time}</p>
                <p className="mt-3 px-2 text-[14px] font-semibold leading-snug">{D.place}</p>
                <a href={D.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-[15px] underline underline-offset-4 decoration-[#ecd9a3]">Lihat Peta</a>
              </OvalFrame>
            </Reveal>
          </Section>

          {/* COUNTDOWN */}
          <Section damaskBg seed={11}>
            <Reveal className="text-center">
              <Title>Menuju Hari Bahagia</Title>
              <p className="mt-3 text-sm tracking-[0.2em] text-[#ecd9a3]">Resepsi · {D.resepsi.dateText}</p>
              <div className="mt-5"><Countdown target={D.resepsi.target} /></div>

              <p className="mt-9 text-xs tracking-[0.2em] text-[#8aa6d0]">Akad · {D.akad.dateText}</p>
              <div className="mt-3"><Countdown target={D.akad.target} small /></div>
            </Reveal>
          </Section>

          {/* RSVP + DAFTAR TAMU */}
          <section className="relative overflow-hidden px-5 pt-16 pb-20" style={{ background: `linear-gradient(180deg,${C.cream},${C.paper})` }}>
            <Reveal className="text-center text-[#16294a]">
              <div className="mx-auto mb-6 w-44 origin-top scale-[.65] -mb-14"><Envelope opened /></div>
              <h2 className="f-script text-[52px] leading-none">Rsvp</h2>
              <p className="mt-3 text-[15px] leading-6">Harap konfirmasi kehadiran Bapak/Ibu/Saudara/i sebelum tanggal {D.rsvpDeadline}</p>
            </Reveal>

            <Reveal className="mt-8">
              <div className="mx-auto h-5 rounded-full shine shadow-md" />
              <div className="mx-3 border-x border-[#cdaa5f]/40 bg-[#fbf7ee] px-5 py-8 text-[#16294a] shadow-xl">
                {done ? (
                  <div className="py-10 text-center">
                    <p className="f-script text-4xl">Terima kasih</p>
                    <p className="mt-2 text-[15px]">Konfirmasi dan doa Anda sudah kami terima.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <label className="block text-sm font-semibold">Nama
                      <input className={`${inputCls} mt-1`} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap" />
                    </label>
                    <div>
                      <p className="text-sm font-semibold">Apakah Anda akan menghadiri pernikahan kami?</p>
                      {['Ya, Saya akan Datang', 'Berhalangan Hadir'].map((o) => (
                        <button key={o} type="button" onClick={() => setForm({ ...form, hadir: o })}
                          className={`mt-2 w-full rounded-md border px-3 py-2.5 text-left text-base transition ${form.hadir === o ? 'border-[#16294a] bg-[#16294a] text-[#f7f2e8]' : 'border-[#cdaa5f]/60 bg-[#efe6d2]'}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                    {form.hadir.startsWith('Ya') && (
                      <label className="block text-sm font-semibold">Jumlah tamu
                        <input type="number" min={1} className={`${inputCls} mt-1`} value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: +e.target.value })} />
                      </label>
                    )}
                    <label className="block text-sm font-semibold">Ucapan untuk kedua mempelai
                      <textarea rows={3} className={`${inputCls} mt-1`} value={form.ucapan} onChange={(e) => setForm({ ...form, ucapan: e.target.value })} />
                    </label>
                    <button onClick={submitRsvp} disabled={sending || !form.nama.trim()} className="w-full rounded-full bg-[#16294a] py-3 text-lg font-semibold text-[#f7f2e8] shadow-lg transition active:scale-95 disabled:opacity-50">
                      {sending ? 'Mengirim…' : 'Kirim RSVP'}
                    </button>
                  </div>
                )}
              </div>
              <div className="mx-auto h-5 rounded-full shine shadow-md" />
            </Reveal>

            <Reveal className="mt-12">
              <h3 className="f-script mb-4 text-center text-[38px] leading-none text-[#16294a]">Tamu yang Hadir</h3>
              <GuestList guests={guests} />
            </Reveal>
          </section>

          {/* TANDA KASIH */}
          <Section curtain seed={8}>
            <Reveal className="text-center">
              <Title>Tanda Kasih</Title>
              <p className="mt-3 text-[15px] leading-7 text-[#cfdcf1]">
                Tanpa mengurangi rasa hormat, kehadiran serta doa restu Anda adalah hadiah terindah bagi kami. Namun, jika Bapak/Ibu/Saudara/i ingin memberikan tanda kasih, dapat disampaikan melalui:
              </p>
              <div className="mt-8 grid gap-4">
                {D.banks.map((b) => (
                  <div key={b.no} className="rounded-2xl border border-[#cdaa5f]/60 bg-[#0d1b33]/85 px-5 py-5">
                    <p className="text-lg font-semibold">{b.bank}</p>
                    <p className="text-[15px] text-[#cfdcf1]">a.n. {b.name}</p>
                    <p className="mt-1 text-2xl tracking-[0.15em] tabular-nums text-[#ecd9a3]">{b.no}</p>
                    <button onClick={() => copy(b.no)} className="mt-3 rounded-full border border-[#ecd9a3] px-5 py-1.5 text-[15px] transition active:scale-95">
                      {copied === b.no ? 'Nomor tersalin' : 'Salin nomor rekening'}
                    </button>
                  </div>
                ))}
              </div>
            </Reveal>
          </Section>

          {/* PENUTUP */}
          <Section damaskBg seed={10} className="pb-24 text-center">
            <Reveal>
              <p className="text-[15px] leading-7 text-[#cfdcf1]">
                Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kebahagiaan dan kehormatan yang tak ternilai bagi kami sekeluarga.
              </p>
              <p className="mt-4 text-[15px] italic text-[#cfdcf1]">Hatur nuhun pisan.</p>
              <p className="mt-6 text-sm tracking-[0.25em] text-[#ecd9a3]">Dengan Penuh Cinta</p>
              <h2 className="f-script mt-3 text-5xl">{D.brideShort} & {D.groomShort}</h2>
            </Reveal>
          </Section>
          <div className="lace" />
        </main>
      )}
    </div>
  );
}