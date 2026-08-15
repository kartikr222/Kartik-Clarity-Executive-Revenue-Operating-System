import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kartik Clarity™ — Founder Revenue Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0B0C0E', padding: '72px', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 32, fontWeight: 800 }}>Kartik Clarity<span style={{ color: '#D4AF37' }}>™</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', color: '#D4AF37', fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>FOUNDER REVENUE INTELLIGENCE™</div>
        <div style={{ display: 'flex', maxWidth: 1000, fontSize: 54, lineHeight: 1.12, fontWeight: 800 }}>Find the revenue your operating system is quietly losing.</div>
      </div>
      <div style={{ display: 'flex', color: '#9CA3AF', fontSize: 20 }}>12 diagnostic engines • kartikclarity.com</div>
    </div>,
    { ...size },
  );
}
