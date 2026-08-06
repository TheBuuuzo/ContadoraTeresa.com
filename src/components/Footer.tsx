import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label="Teresa Castro — início">
          <img
            src="/tete-logo.png?v=3"
            alt="Teresa Castro — Eleição 2026"
            className={styles.logo}
            width={220}
            height={50}
          />
        </a>
        <div className={styles.meta}>
          <span>© {new Date().getFullYear()} Caule Gestão Digital Ltda</span>
        </div>
      </div>
    </footer>
  );
}
