import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <nav className={styles.nav} aria-label="Principal">
          <a href="#estrutura">Estrutura</a>
          <a href="#apoio">Apoio</a>
          <a href="#orcamento" className={styles.cta}>
            Orçamento
          </a>
        </nav>
      </div>
    </header>
  );
}
