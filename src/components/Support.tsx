import styles from "./Support.module.css";

const items = [
  {
    title: "Contratos da campanha",
    text: "Emissão e organização de contratos com prestadores e fornecedores, com coleta de dados por fluxo digital — pronto para o arquivo da prestação.",
  },
  {
    title: "Notas e documentação",
    text: "Apoio para reunir e organizar notas fiscais e documentos essenciais, reduzindo o risco de pendência na hora de prestar contas.",
  },
  {
    title: "Gestão financeira da campanha",
    text: "Acompanhamento de receitas, despesas e rotinas administrativas, para a candidatura decidir com informação e cumprir o calendário eleitoral.",
  },
  {
    title: "Prestação alinhada ao escritório",
    text: "Tudo o que a campanha produz chega ao contador no formato certo. Menos retrabalho, mais segurança na entrega final.",
  },
];

export function Support() {
  return (
    <section id="apoio" className={`section ${styles.section}`}>
      <div className="wrap">
        <p className="section-label">Como apoiamos</p>
        <h2 className={`section-title ${styles.title}`}>
          Facilitamos o que a campanha não pode deixar para depois.
        </h2>
        <p className="section-lead">
          Não vendemos software — entregamos uma operação contábil com
          ferramentas próprias que tiram atrito do caminho: contratos
          organizados, notas localizadas e gestão sob controle.
        </p>
        <div className={styles.rows}>
          {items.map((item) => (
            <article key={item.title} className={styles.row}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
