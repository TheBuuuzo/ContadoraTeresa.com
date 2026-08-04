import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
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
