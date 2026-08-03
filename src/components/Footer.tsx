import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/tete-logo.png?v=2" alt="Teresa Castro" width={180} height={95} />
          <p>
            Contabilidade e gestão para campanhas eleitorais.
            <br />
            Eleição 2026.
          </p>
        </div>
        <div className={styles.meta}>
          <a href="#orcamento">Solicitar orçamento</a>
          <a href="mailto:contato@contadorateresa.com">contato@contadorateresa.com</a>
          <span>© {new Date().getFullYear()} Teresa Castro</span>
        </div>
      </div>
    </footer>
  );
}
