import { useEffect, useRef } from 'react';

const PETAL_COLORS = [
  ['#f7c5d0', '#fde8ee'],
  ['#f4b8c8', '#fbd9e4'],
  ['#e8a0b5', '#f5c9d8'],
  ['#fbc9d4', '#feeaf0'],
  ['#f2afc2', '#f9d5e2'],
];

export default function RosePetals() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const petalsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const cores    = navigator.hardwareConcurrency || 4;
    const isLowEnd = isMobile && cores <= 4;

    const MAX_PETALS   = isLowEnd ? 8  : isMobile ? 12 : 20;
    const SPAWN_CHANCE = isLowEnd ? 0.010 : isMobile ? 0.016 : 0.028;
    const FRAME_SKIP   = isMobile ? 2 : 1;
    let   frameCount   = 0;

    // Cap DPR to 1 on low-end to halve canvas pixel work
    const dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    // Logical (CSS) dimensions — updated on resize
    let W = window.innerWidth;
    let H = window.innerHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      // Physical pixel size
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      // CSS display size
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      // Re-apply scale AFTER every resize so it never stacks
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ctx = canvas.getContext('2d', { alpha: true });

    // Initial size (ctx must exist before setSize, since setSize uses ctx)
    setSize();
    window.addEventListener('resize', setSize, { passive: true });

    const createPetal = () => ({
      x:         Math.random() * W,
      y:         -30,
      rotation:  Math.random() * 360,
      rotSpeed:  (Math.random() - 0.5) * 4,
      speed:     1.2 + Math.random() * 2,
      drift:     (Math.random() - 0.5) * 1.2,
      sway:      Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.02,
      width:     10 + Math.random() * 8,
      height:    13 + Math.random() * 8,
      colors:    PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      opacity:   0.6 + Math.random() * 0.35,
    });

    // Pre-seed petals spread across screen
    const initCount = Math.min(isLowEnd ? 5 : isMobile ? 8 : 16, MAX_PETALS);
    for (let i = 0; i < initCount; i++) {
      const p = createPetal();
      p.y = Math.random() * H;
      petalsRef.current.push(p);
    }

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      frameCount++;
      // Frame-skip on mobile for ~30fps
      if (FRAME_SKIP > 1 && frameCount % FRAME_SKIP !== 0) return;

      // Clear in logical coords (ctx is already scaled via setTransform)
      ctx.clearRect(0, 0, W, H);

      // Occasionally spawn a new petal
      if (Math.random() < SPAWN_CHANCE && petalsRef.current.length < MAX_PETALS) {
        petalsRef.current.push(createPetal());
      }

      // Remove petals that have fallen off screen
      petalsRef.current = petalsRef.current.filter(p => p.y < H + 60);

      for (const p of petalsRef.current) {
        p.sway     += p.swaySpeed;
        p.x        += Math.sin(p.sway) * 0.8 + p.drift;
        p.y        += p.speed;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // Petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -p.width * 0.9,  -p.height * 0.15,
          -p.width * 1.1,  -p.height * 0.7,
          -p.width * 0.4,  -p.height * 0.95
        );
        ctx.quadraticCurveTo(-p.width * 0.1, -p.height * 1.02, 0, -p.height);
        ctx.quadraticCurveTo( p.width * 0.1, -p.height * 1.02, p.width * 0.4, -p.height * 0.95);
        ctx.bezierCurveTo(
           p.width * 1.1,  -p.height * 0.7,
           p.width * 0.9,  -p.height * 0.15,
           0, 0
        );
        ctx.closePath();

        const g = ctx.createLinearGradient(0, 0, 0, -p.height);
        g.addColorStop(0, p.colors[0]);
        g.addColorStop(1, p.colors[1]);
        ctx.fillStyle = g;
        ctx.fill();

        // Vein — skip on low-end devices
        if (!isLowEnd) {
          ctx.beginPath();
          ctx.moveTo(0, -p.height * 0.1);
          ctx.quadraticCurveTo(p.width * 0.08, -p.height * 0.5, 0, -p.height * 0.85);
          ctx.strokeStyle = 'rgba(200,140,160,0.25)';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="petals-canvas" />;
}