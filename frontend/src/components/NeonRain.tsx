"use client";

import { useEffect, useRef } from "react";
import styles from "./NeonRain.module.css";

type Drop = {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  cyan: boolean;
};

/**
 * Blade Runner atmosphere: slanted neon rain over a dark LA night.
 * Kept dim so the chat panel stays high-contrast and readable.
 */
export default function NeonRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drops: Drop[] = [];
    let animationId = 0;
    let lastFrame = 0;
    const frameInterval = 33;

    const spawnDrop = (width: number, height: number): Drop => ({
      x: Math.random() * (width + 120) - 60,
      y: Math.random() * -height,
      length: 12 + Math.random() * 22,
      speed: 6 + Math.random() * 10,
      opacity: 0.12 + Math.random() * 0.28,
      cyan: Math.random() > 0.72,
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      drops = Array.from({ length: Math.max(48, count) }, () =>
        spawnDrop(canvas.width, canvas.height),
      );
    };

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;

      // Night wash with a faint warm haze near the horizon
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      sky.addColorStop(0, "#07040f");
      sky.addColorStop(0.55, "#12081c");
      sky.addColorStop(1, "#1a0c14");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant neon bloom (city glow) — visual anchor, not flat black
      const bloom = ctx.createRadialGradient(
        canvas.width * 0.72,
        canvas.height * 0.78,
        20,
        canvas.width * 0.72,
        canvas.height * 0.78,
        canvas.width * 0.55,
      );
      bloom.addColorStop(0, "rgba(255, 90, 40, 0.22)");
      bloom.addColorStop(0.35, "rgba(255, 45, 120, 0.08)");
      bloom.addColorStop(1, "transparent");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bloom2 = ctx.createRadialGradient(
        canvas.width * 0.18,
        canvas.height * 0.65,
        10,
        canvas.width * 0.18,
        canvas.height * 0.65,
        canvas.width * 0.4,
      );
      bloom2.addColorStop(0, "rgba(40, 210, 255, 0.14)");
      bloom2.addColorStop(1, "transparent");
      ctx.fillStyle = bloom2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Slanted rain streaks
      for (const drop of drops) {
        const x2 = drop.x - drop.length * 0.35;
        const y2 = drop.y + drop.length;
        const grad = ctx.createLinearGradient(drop.x, drop.y, x2, y2);
        if (drop.cyan) {
          grad.addColorStop(0, `rgba(80, 230, 255, ${drop.opacity})`);
          grad.addColorStop(1, "rgba(80, 230, 255, 0)");
        } else {
          grad.addColorStop(0, `rgba(255, 200, 150, ${drop.opacity})`);
          grad.addColorStop(1, "rgba(255, 180, 120, 0)");
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        drop.x -= drop.speed * 0.28;
        drop.y += drop.speed;

        if (drop.y > canvas.height + 40 || drop.x < -80) {
          Object.assign(drop, spawnDrop(canvas.width, canvas.height));
          drop.y = -20;
        }
      }
    };

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.rain}
      aria-hidden="true"
    />
  );
}
