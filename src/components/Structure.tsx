import styles from "./Structure.module.css";

const pillars = [
  {
    title: "Operação centralizada",
    text: "Toda a rotina da campanha — do cadastro à prestação — flui por um mesmo ambiente, sem planilhas soltas nem pastas perdidas.",
  },
  {
    title: "Canal com o escritório",
    text: "A campanha entrega o que precisa entregar; o escritório consolida, valida e acompanha. Menos idas e vindas, mais clareza.",
  },
  {
    title: "Facilitadores digitais",
    text: "Ferramentas personalizadas aceleram emissão de contratos, coleta de dados de prestadores e a busca organizada de notas — para a gestão caminhar no ritmo da campanha.",
  },
];

export function Structure() {
  return (
    <section id="estrutura" className={styles.section}>
      <div className="wrap">
        <img
          src="/tete-logo.png?v=2"
          alt="Teresa Castro — Eleição 2026"
          className={styles.logo}
          width={420}
          height={220}
        />
        <p className="section-label">Nossa estrutura</p>
        <div className={styles.grid}>
          <div>
            <h2 className="section-title">Um escritório pensado para a urgência eleitoral.</h2>
            <p className="section-lead">
              Por trás do atendimento há uma estrutura tecnológica e humana
              preparada para campanhas: processos definidos, equipe dedicada e
              sistemas que facilitam o dia a dia sem complicar a candidatura.
            </p>
          </div>
          <ul className={styles.list}>
            {pillars.map((item, i) => (
              <li key={item.title} style={{ animationDelay: `${0.08 * i}s` }}>
                <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
