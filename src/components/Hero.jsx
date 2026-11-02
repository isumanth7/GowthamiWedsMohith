import { motion } from 'framer-motion';

// Reduced to 4 twinkles on mobile-friendly positions — less DOM/animation work
const TWINKLES = [
  { left: '10%', top: '18%', delay: '0.2s' },
  { left: '84%', top: '12%', delay: '1.1s' },
  { left: '18%', top: '70%', delay: '2.0s' },
  { left: '90%', top: '62%', delay: '0.6s' },
];

export default function Hero() {
  return (
    <section id="hero">
      {TWINKLES.map((t, i) => (
        <i
          key={i}
          className="twinkle"
          style={{ left: t.left, top: t.top, animationDelay: t.delay }}
        />
      ))}

      <div className="wrap">
        <motion.div
          className="arch-frame"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Monogram */}
          <motion.div
            className="hero-mono"
            initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.3, 1.4, 0.4, 1] }}
          >
            G&amp;M
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
          >
            Together with their families
          </motion.p>

          {/* Names — single motion per name instead of per-letter */}
          <h1 className="hero-names script">
            <motion.span
              style={{ display: 'block' }}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
            >
              Gowthami
            </motion.span>
            <motion.span
              className="hero-amp"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.7, ease: [0.3, 1.4, 0.4, 1] }}
              style={{ display: 'block' }}
            >
              &amp;
            </motion.span>
            <motion.span
              style={{ display: 'block' }}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 1.9, ease: [0.2, 0.7, 0.2, 1] }}
            >
              Mohith
            </motion.span>
          </h1>

          {/* Lead */}
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.2 }}
          >
            request the joy of your presence<br />as they begin their forever
          </motion.p>

          {/* Date */}
          <motion.div
            className="hero-date"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.6 }}
          >
            Friday, 20 · November · 2026
          </motion.div>

          {/* Families */}
          <motion.div
            className="hero-families"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 3.0 }}
          >
            <p>
              <b>Gowthami N.V.</b>
              <span>Only Daughter of</span>
              <span>Smt. Sujathamma &amp; Sri N.K. VenkataReddy</span>
            </p>
            <p>
              <b>C. Mohith Reddy</b>
              <span>Elder Son of</span>
              <span>Smt. S.K. Amaravathi &amp; Sri B.K. Venkatesh Reddy</span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-indicator">Scroll</div>
    </section>
  );
}