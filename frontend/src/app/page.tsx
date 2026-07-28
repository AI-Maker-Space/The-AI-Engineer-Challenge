import NeonRain from "@/components/NeonRain";
import TerminalChat from "@/components/TerminalChat";
import styles from "./page.module.css";

/**
 * Single composition: rainy neon city as atmosphere, NEURAL_COACH console as the product.
 * Brand sits as the hero signal inside the console chrome.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <NeonRain />
      <div className={styles.vignette} aria-hidden="true" />
      <main className={styles.main}>
        <TerminalChat />
      </main>
    </div>
  );
}
