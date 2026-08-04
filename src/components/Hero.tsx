import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="topo" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <img
          src="/hero-teresa.jpg"
          alt="Teresa Castro"
          width={1200}
          height={1500}
        />
      </div>
      <div className={styles.copy}>
        <div className={styles.copyInner}>
          <h1 id="hero-title">
            Um escritório pensado
            <br />
            para a urgência eleitoral
          </h1>
          <p>
            Cuidamos da parte administrativa e financeira da campanha com uma
            estrutura tecnológica e humana pensada pra isso: processos
            definidos, equipe dedicada e sistemas que tiram atrito do caminho
            para sua equipe focar no que só ela pode fazer:{" "}
            <strong>campanha</strong>.
          </p>
          <a href="#orcamento" className={`btn btn-terracotta ${styles.cta}`}>
            Falar com o escritório
          </a>
        </div>
      </div>
    </section>
  );
}
