import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="topo" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <img
          src="/hero-teresa.jpg"
          alt=""
          width={1200}
          height={1500}
        />
      </div>
      <div className={`wrap ${styles.content}`}>
        <div className={styles.copy}>
          <h1 id="hero-title">
            Um escritório pensado
            <br />
            <span className={styles.titleLine}>para a urgência eleitoral</span>
          </h1>
          <p>
            Cuidamos da parte administrativa e financeira da campanha com uma
            estrutura tecnológica e humana pensada pra isso: processos
            definidos, equipe dedicada e sistemas que tiram atrito do caminho
          </p>
          <p className={styles.emphasis}>
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
