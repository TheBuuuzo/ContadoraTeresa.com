import styles from "./Support.module.css";

const items = [
  "Contratos com prestadores e fornecedores, emitidos e organizados por fluxo digital.",
  "Notas fiscais e documentos reunidos e organizados, sem pendência na prestação de contas.",
  "Receitas, despesas e rotinas administrativas com rotina de acompanhamento para tomada de decisões.",
  "Tudo o que a campanha produz chega ao contador com menos retrabalho e mais segurança na entrega final.",
];

export function Support() {
  return (
    <section id="apoio" className={styles.section}>
      <div className={styles.copy}>
        <div className={styles.copyInner}>
          <h2>O que fazemos para facilitar sua rotina</h2>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.media}>
        <img
          src="/rotina-mesa.jpg"
          alt="Rotina de trabalho com organização e acompanhamento"
          width={1200}
          height={1500}
        />
      </div>
    </section>
  );
}
