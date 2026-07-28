import MatrixRain from "@/components/MatrixRain";
import TerminalChat from "@/components/TerminalChat";
import styles from "./page.module.css";

/**
 * Single-composition landing: digital rain atmosphere + terminal as the product.
 * Brand (NEURAL_COACH) lives in the terminal chrome as the hero signal.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <MatrixRain />
      <main className={styles.main}>
        <TerminalChat />
      </main>
    </div>
  );
}
