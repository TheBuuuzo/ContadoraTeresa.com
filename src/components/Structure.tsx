import styles from "./Structure.module.css";

const cards = [
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
        <header className={styles.head}>
          <h2>
            Facilitamos o que a campanha não pode deixar para depois
          </h2>
          <p>
            <strong>Não vendemos software:</strong> entregamos uma operação
            contábil com ferramentas personalizadas que tiram atrito do caminho.
          </p>
        </header>
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
