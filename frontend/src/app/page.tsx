import Image from "next/image";
import styles from "./page.module.css";
import MainComponent from "./main-component.tsx";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <MainComponent />
      </div>
    </main>
  );
}
