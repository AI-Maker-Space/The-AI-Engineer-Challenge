"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const BALL_COUNT = 24;
const MAX_SPEED = 2.3;
const MIN_RADIUS = 10;
const MAX_RADIUS = 28;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBall(width, height, color) {
  const radius = randomBetween(MIN_RADIUS, MAX_RADIUS);
  const safeWidth = Math.max(width, radius * 2 + 1);
  const safeHeight = Math.max(height, radius * 2 + 1);

  return {
    x: randomBetween(radius, safeWidth - radius),
    y: randomBetween(radius, safeHeight - radius),
    vx: randomBetween(-MAX_SPEED, MAX_SPEED) || 1.1,
    vy: randomBetween(-MAX_SPEED, MAX_SPEED) || -1.1,
    radius,
    color
  };
}

export default function Page() {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [inputMessage, setInputMessage] = useState("");
  const [coachReply, setCoachReply] = useState(
    "Say hi to the backend-powered AI coach."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  const palette = useMemo(
    () => ["#00E5FF", "#A855F7", "#22C55E", "#F97316", "#F43F5E", "#38BDF8"],
    []
  );

  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setSize({ width: clientWidth, height: clientHeight });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) return;

    setBalls(
      Array.from({ length: BALL_COUNT }, (_, index) =>
        createBall(size.width, size.height, palette[index % palette.length])
      )
    );
  }, [palette, size.height, size.width]);

  useEffect(() => {
    if (!size.width || !size.height || balls.length === 0) return;

    const animate = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy, radius } = ball;

          x += vx;
          y += vy;

          if (x - radius <= 0 || x + radius >= size.width) {
            vx *= -1;
            x = Math.min(Math.max(radius, x), size.width - radius);
          }

          if (y - radius <= 0 || y + radius >= size.height) {
            vy *= -1;
            y = Math.min(Math.max(radius, y), size.height - radius);
          }

          return { ...ball, x, y, vx, vy };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [balls.length, size.height, size.width]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage = inputMessage.trim();

    if (!trimmedMessage || isLoading) return;

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";

    setIsLoading(true);
    setRequestError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: trimmedMessage })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || "The backend request failed.");
      }

      setCoachReply(payload.reply || "The coach responded with no message.");
      setInputMessage("");
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Could not reach the backend. Is it running?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main ref={containerRef} className="screen">
      {balls.map((ball, idx) => (
        <span
          key={idx}
          className="ball"
          style={{
            width: ball.radius * 2,
            height: ball.radius * 2,
            transform: `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`,
            backgroundColor: ball.color
          }}
        />
      ))}
      <section className="overlay">
        <h1>Bouncing Balls</h1>
        <p>Screensaver animation + backend-connected AI coach.</p>
      </section>
      <section className="chatPanel" aria-live="polite">
        <h2>AI Coach</h2>
        <p className="chatHint">Powered by the FastAPI backend at `/api/chat`.</p>
        <form onSubmit={handleSubmit} className="chatForm">
          <label htmlFor="coach-message">Message</label>
          <textarea
            id="coach-message"
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            placeholder="Ask for a quick motivational boost..."
            maxLength={500}
          />
          <button type="submit" disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
        <div className="replyBox">
          <strong>Reply</strong>
          <p>{coachReply}</p>
          {requestError ? <p className="errorText">{requestError}</p> : null}
        </div>
      </section>
    </main>
  );
}
