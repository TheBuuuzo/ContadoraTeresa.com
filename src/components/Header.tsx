import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label="Teresa Castro — início">
          <img src="/tete-logo.png" alt="" className={styles.mark} width={40} height={40} />
          <span className={styles.name}>Teresa Castro</span>
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
