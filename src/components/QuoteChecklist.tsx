import { FormEvent, useMemo, useState } from "react";
import styles from "./QuoteChecklist.module.css";

const NEEDS = [
  { id: "contratos", label: "Emissão e gestão de contratos com prestadores" },
  { id: "notas", label: "Organização e busca de notas fiscais" },
  { id: "financeiro", label: "Acompanhamento financeiro da campanha" },
  { id: "documentacao", label: "Envio e controle de documentação" },
  { id: "prestacao", label: "Apoio à prestação de contas eleitorais" },
  { id: "equipe", label: "Orientação para a equipe da campanha" },
] as const;

const CARGOS = [
  "Deputado Federal",
  "Deputado Estadual",
  "Senador",
  "Governador",
  "Outro / a definir",
];

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  uf: string;
  municipio: string;
  cnpj: string;
  inicio: string;
  observacoes: string;
  needs: string[];
};

const initial: FormState = {
  nome: "",
  email: "",
  telefone: "",
  cargo: "",
  uf: "",
  municipio: "",
  cnpj: "ainda-nao",
  inicio: "",
  observacoes: "",
  needs: [],
};

export function QuoteChecklist() {
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);

  const progress = useMemo(() => {
    let score = 0;
    if (form.nome.trim()) score += 1;
    if (form.email.trim()) score += 1;
    if (form.telefone.trim()) score += 1;
    if (form.cargo) score += 1;
    if (form.uf.trim()) score += 1;
    if (form.needs.length > 0) score += 1;
    return Math.round((score / 6) * 100);
  }, [form]);

  function toggleNeed(id: string) {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(id)
        ? prev.needs.filter((n) => n !== id)
        : [...prev.needs, id],
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const needsLabels = NEEDS.filter((n) => form.needs.includes(n.id))
      .map((n) => `• ${n.label}`)
      .join("%0A");

    const body = [
      `Olá, Teresa. Gostaria de solicitar orçamento para a campanha 2026.`,
      ``,
      `Nome: ${form.nome}`,
      `E-mail: ${form.email}`,
      `Telefone: ${form.telefone}`,
      `Cargo pretendido: ${form.cargo}`,
      `UF: ${form.uf}`,
      `Município: ${form.municipio || "—"}`,
      `CNPJ de campanha: ${
        form.cnpj === "sim" ? "Já possui" : form.cnpj === "em-andamento" ? "Em andamento" : "Ainda não"
      }`,
      `Início desejado: ${form.inicio || "A combinar"}`,
      ``,
      `Necessidades:`,
      needsLabels || "• A definir",
      ``,
      `Observações:`,
      form.observacoes || "—",
    ].join("%0A");

    const subject = encodeURIComponent(`Orçamento campanha 2026 — ${form.nome}`);
    window.location.href = `mailto:contato@contadorateresa.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="orcamento" className={`section ${styles.section}`}>
      <div className="wrap">
        <p className="section-label">Checklist de orçamento</p>
        <div className={styles.head}>
          <h2 className="section-title">Monte o pedido da sua campanha.</h2>
          <p className="section-lead">
            Marque o que a candidatura precisa. Usamos este checklist para
            preparar uma proposta objetiva — sem surpresas no meio do caminho.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
          <div className={styles.progress} aria-hidden="true">
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}% do essencial</span>
          </div>

          <fieldset className={styles.fieldset}>
            <legend>1. Quem somos</legend>
            <div className={styles.fields}>
              <label>
                Nome completo
                <input
                  required
                  name="nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome ou responsável pela campanha"
                />
              </label>
              <label>
                E-mail
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nome@email.com"
                />
              </label>
              <label>
                Telefone / WhatsApp
                <input
                  required
                  type="tel"
                  name="telefone"
                  autoComplete="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>2. Sobre a candidatura</legend>
            <div className={styles.fields}>
              <label>
                Cargo pretendido
                <select
                  required
                  name="cargo"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                UF
                <input
                  required
                  name="uf"
                  maxLength={2}
                  value={form.uf}
                  onChange={(e) =>
                    setForm({ ...form, uf: e.target.value.toUpperCase() })
                  }
                  placeholder="RJ"
                />
              </label>
              <label>
                Município base
                <input
                  name="municipio"
                  value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                  placeholder="Opcional"
                />
              </label>
              <label>
                Já possui CNPJ de campanha?
                <select
                  name="cnpj"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                >
                  <option value="ainda-nao">Ainda não</option>
                  <option value="em-andamento">Em andamento</option>
                  <option value="sim">Sim</option>
                </select>
              </label>
              <label>
                Quando deseja iniciar?
                <input
                  type="month"
                  name="inicio"
                  value={form.inicio}
                  onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>3. O que precisamos neste orçamento</legend>
            <p className={styles.hint}>Selecione todos os itens que se aplicam.</p>
            <ul className={styles.checks}>
              {NEEDS.map((need) => {
                const checked = form.needs.includes(need.id);
                return (
                  <li key={need.id}>
                    <label className={checked ? styles.checked : undefined}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleNeed(need.id)}
                      />
                      <span className={styles.box} aria-hidden="true" />
                      <span>{need.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>4. Observações</legend>
            <label className={styles.full}>
              Algo que devemos saber?
              <textarea
                name="observacoes"
                rows={4}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Prazo, volume estimado de contratos, particularidades da campanha…"
              />
            </label>
          </fieldset>

          <div className={styles.footer}>
            <p>
              Ao enviar, abrimos seu e-mail com o checklist preenchido para
              contato@contadorateresa.com. Você pode revisar antes de despachar.
            </p>
            <button type="submit" className={styles.submit}>
              Enviar solicitação de orçamento
            </button>
            {sent && (
              <p className={styles.confirm} role="status">
                Checklist pronto. Confirme o envio no seu aplicativo de e-mail.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
