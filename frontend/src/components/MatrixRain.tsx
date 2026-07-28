"use client";

import { useEffect, useRef } from "react";
import styles from "./MatrixRain.module.css";

/**
 * Full-viewport digital-rain canvas that sits behind the terminal.
 * Kept intentionally dim so chat text stays readable (contrast rule).
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glyphs =
      "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF<>$*+#";
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];
    let animationId = 0;
    let lastFrame = 0;
    const frameInterval = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -40),
      );
    };

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;

      // Soft trail fade keeps glyphs readable without washing out the UI
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head glyph is brighter; trail stays muted for contrast with the terminal
        ctx.fillStyle = "rgba(0, 255, 65, 0.35)";
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    resize();
    // Seed a black frame so the first fade doesn't flash white
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
