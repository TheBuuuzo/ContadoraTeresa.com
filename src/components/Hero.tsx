import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="topo" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.plane} aria-hidden="true" />
      <div className={`wrap ${styles.content}`}>
        <img
          src="/tete-logo.png"
          alt="Teresa Castro — Eleição 2026"
          className={styles.logo}
          width={420}
          height={220}
        />
        <h1 id="hero-title" className={styles.title}>
          Contabilidade que sustenta a campanha do início ao balanço.
        </h1>
        <p className={styles.lead}>
          Estrutura profissional para organizar contratos, documentação e a
          rotina financeira da sua candidatura em 2026.
        </p>
        <div className={styles.actions}>
          <a href="#orcamento" className={styles.primary}>
            Solicitar orçamento
          </a>
          <a href="#estrutura" className={styles.secondary}>
            Conhecer a estrutura
          </a>
        </div>
      </div>
    </section>
  );
}
