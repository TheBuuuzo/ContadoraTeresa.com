import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.name}>Teresa Castro</span>
          <span className={styles.tag}>Soluções Eleitorais</span>
        </div>
        <div className={styles.meta}>
          <a href="#orcamento">Solicitar orçamento</a>
          <span>© {new Date().getFullYear()} Teresa Castro</span>
        </div>
      </div>
    </footer>
  );
}
