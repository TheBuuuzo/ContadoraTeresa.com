import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./QuoteChecklist.module.css";

const CARGOS = [
  "Deputado Federal",
  "Deputado Estadual",
  "Senador",
  "Governador",
] as const;

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const SERVICOS = [
  {
    id: "contratos",
    label: "Terceirização da emissão dos contratos para assinatura",
  },
  {
    id: "administrador",
    label: "Administrador Financeiro",
  },
] as const;

function formatCurrencyBRL(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const amount = Number(digits) / 100;
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parsePercent(value: string): number {
  if (!value.trim()) return 0;
  const n = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

function sanitizePercentInput(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
  if (!cleaned) return "";
  const parts = cleaned.split(".");
  const whole = parts[0].slice(0, 3);
  const decimal = parts[1] !== undefined ? parts[1].slice(0, 2) : undefined;
  const next = decimal !== undefined ? `${whole}.${decimal}` : whole;
  const n = Number(next);
  if (!Number.isFinite(n)) return "";
  if (n > 100) return "100";
  return next;
}

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  representante: boolean;
  nomeCandidato: string;
  cargo: string;
  uf: string;
  municipio: string;
  partido: string;
  previsaoGastos: string;
  pctPessoal: string;
  pctImpulsionamento: string;
  pctMaterialConjunto: string;
  observacoes: string;
  servicos: string[];
};

const initial: FormState = {
  nome: "",
  email: "",
  telefone: "",
  representante: false,
  nomeCandidato: "",
  cargo: "",
  uf: "",
  municipio: "",
  partido: "",
  previsaoGastos: "",
  pctPessoal: "",
  pctImpulsionamento: "",
  pctMaterialConjunto: "",
  observacoes: "",
  servicos: [],
};

export function QuoteChecklist() {
  const [form, setForm] = useState<FormState>(initial);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!form.uf) {
      setMunicipios([]);
      return;
    }

    const controller = new AbortController();
    setLoadingMunicipios(true);
    setMunicipios([]);

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.uf}/municipios?orderBy=nome`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar municípios");
        return res.json() as Promise<{ nome: string }[]>;
      })
      .then((data) => {
        setMunicipios(data.map((m) => m.nome));
        setLoadingMunicipios(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setMunicipios([]);
        setLoadingMunicipios(false);
      });

    return () => controller.abort();
  }, [form.uf]);

  const gastoTotalPct = useMemo(() => {
    return (
      parsePercent(form.pctPessoal) +
      parsePercent(form.pctImpulsionamento) +
      parsePercent(form.pctMaterialConjunto)
    );
  }, [form.pctPessoal, form.pctImpulsionamento, form.pctMaterialConjunto]);

  const gastoBarPct = Math.min(100, Math.round(gastoTotalPct * 10) / 10);
  const gastoComplete = Math.abs(gastoTotalPct - 100) < 0.01;
  const gastoOver = gastoTotalPct > 100;

  const progress = useMemo(() => {
    const checks = [
      form.nome.trim().length > 0,
      form.email.trim().length > 0,
      form.telefone.trim().length > 0,
      form.cargo.length > 0,
      form.uf.length > 0,
      form.municipio.length > 0,
      form.partido.trim().length > 0,
      form.previsaoGastos.replace(/\D/g, "").length > 0 &&
        Number(form.previsaoGastos.replace(/\D/g, "")) > 0,
      form.pctPessoal !== "",
      form.pctImpulsionamento !== "",
      form.pctMaterialConjunto !== "",
      gastoComplete,
    ];

    if (form.representante) {
      checks.push(form.nomeCandidato.trim().length > 0);
    }

    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form, gastoComplete]);

  function toggleServico(id: string) {
    setForm((prev) => ({
      ...prev,
      servicos: prev.servicos.includes(id)
        ? prev.servicos.filter((s) => s !== id)
        : [...prev.servicos, id],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSent(false);

    if (!gastoComplete) {
      setSubmitError(
        gastoOver
          ? "A soma dos percentuais passou de 100%. Ajuste os valores."
          : "Distribua os gastos até fechar 100% nos três tipos."
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim(),
          representante: form.representante,
          nomeCandidato: form.nomeCandidato.trim(),
          cargo: form.cargo,
          uf: form.uf,
          municipio: form.municipio,
          partido: form.partido.trim(),
          previsaoGastos: form.previsaoGastos,
          pctPessoal: parsePercent(form.pctPessoal),
          pctImpulsionamento: parsePercent(form.pctImpulsionamento),
          pctMaterialConjunto: parsePercent(form.pctMaterialConjunto),
          observacoes: form.observacoes.trim(),
          servicos: form.servicos,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: number;
        erro?: string;
        mensagem?: string;
      };

      if (!res.ok) {
        throw new Error(data.erro || "Não foi possível enviar a solicitação.");
      }

      setSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao enviar a solicitação."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="orcamento" className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <h2 className={styles.title}>Monte o pedido da sua campanha</h2>
          <p className={styles.lead}>
            Preencha o checklist para prepararmos uma proposta objetiva, sem
            surpresas no meio do caminho.
          </p>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.progress} aria-hidden="true">
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}% do essencial</span>
          </div>

          <fieldset className={styles.fieldset}>
            <legend>1. Quem somos</legend>
            <div className={styles.fields}>
              <label className={styles.span2}>
                Nome completo do solicitante
                <input
                  required
                  name="nome"
                  autoComplete="name"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Nome de quem está solicitando o orçamento"
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

            <label
              className={`${styles.checkRow} ${form.representante ? styles.checked : ""}`}
            >
              <input
                type="checkbox"
                checked={form.representante}
                onChange={(e) =>
                  setForm({
                    ...form,
                    representante: e.target.checked,
                    nomeCandidato: e.target.checked ? form.nomeCandidato : "",
                  })
                }
              />
              <span className={styles.box} aria-hidden="true" />
              <span>Sou representante de um candidato</span>
            </label>

            {form.representante && (
              <div className={styles.fields}>
                <label className={styles.span2}>
                  Nome do candidato
                  <input
                    required
                    name="nomeCandidato"
                    value={form.nomeCandidato}
                    onChange={(e) =>
                      setForm({ ...form, nomeCandidato: e.target.value })
                    }
                    placeholder="Nome completo do candidato"
                  />
                </label>
              </div>
            )}
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
                Sigla do partido
                <input
                  required
                  name="partido"
                  value={form.partido}
                  onChange={(e) =>
                    setForm({ ...form, partido: e.target.value.toUpperCase() })
                  }
                  placeholder=""
                  maxLength={20}
                />
              </label>
              <label>
                UF
                <select
                  required
                  name="uf"
                  value={form.uf}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      uf: e.target.value,
                      municipio: "",
                    })
                  }
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Município
                <select
                  required
                  name="municipio"
                  value={form.municipio}
                  disabled={!form.uf || loadingMunicipios}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                >
                  <option value="" disabled>
                    {!form.uf
                      ? "Selecione a UF primeiro"
                      : loadingMunicipios
                        ? "Carregando…"
                        : "Selecione"}
                  </option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>3. O que precisamos saber sobre a campanha</legend>
            <div className={styles.fields}>
              <label className={styles.span2}>
                Previsão de gastos de campanha
                <input
                  required
                  name="previsaoGastos"
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.previsaoGastos}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      previsaoGastos: formatCurrencyBRL(e.target.value),
                    })
                  }
                  placeholder="R$ 0,00"
                />
              </label>
            </div>

            <p className={styles.hint}>
              Informe o percentual estimado de gasto em cada tipo. A soma deve
              fechar 100%.
            </p>

            <div
              className={`${styles.gastoBar} ${
                gastoComplete
                  ? styles.gastoOk
                  : gastoOver
                    ? styles.gastoOver
                    : ""
              }`}
              aria-live="polite"
            >
              <div className={styles.gastoBarHead}>
                <span>Distribuição dos gastos</span>
                <strong>
                  {gastoBarPct.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                  })}
                  % / 100%
                </strong>
              </div>
              <div className={styles.gastoTrack}>
                <div
                  className={styles.gastoFill}
                  style={{ width: `${Math.min(100, gastoBarPct)}%` }}
                />
              </div>
              <p className={styles.gastoStatus}>
                {gastoComplete
                  ? "Distribuição completa."
                  : gastoOver
                    ? `Excedeu ${((gastoTotalPct - 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 }))}%.`
                    : `Faltam ${((100 - gastoTotalPct).toLocaleString("pt-BR", { maximumFractionDigits: 2 }))}% para fechar.`}
              </p>
            </div>

            <div className={styles.percentGrid}>
              <PercentField
                label="Contratação de pessoal"
                value={form.pctPessoal}
                onChange={(value) => setForm({ ...form, pctPessoal: value })}
              />
              <PercentField
                label="Impulsionamento na internet"
                value={form.pctImpulsionamento}
                onChange={(value) =>
                  setForm({ ...form, pctImpulsionamento: value })
                }
              />
              <PercentField
                label="Material em conjunto com outros candidatos"
                value={form.pctMaterialConjunto}
                onChange={(value) =>
                  setForm({ ...form, pctMaterialConjunto: value })
                }
              />
            </div>

            <label className={styles.full}>
              Observação (opcional)
              <textarea
                name="observacoes"
                rows={4}
                value={form.observacoes}
                onChange={(e) =>
                  setForm({ ...form, observacoes: e.target.value })
                }
                placeholder="Algo que a campanha queira nos passar sobre a operação ou particularidades…"
              />
            </label>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>4. Serviços adicionais</legend>
            <p className={styles.hint}>Marque os serviços desejados, se houver.</p>
            <ul className={styles.checks}>
              {SERVICOS.map((servico) => {
                const checked = form.servicos.includes(servico.id);
                return (
                  <li key={servico.id}>
                    <label className={checked ? styles.checked : undefined}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleServico(servico.id)}
                      />
                      <span className={styles.box} aria-hidden="true" />
                      <span>{servico.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className={styles.footer}>
            <p>
              Em breve retornaremos o contato com a proposta.
            </p>
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? "Enviando…" : "Enviar solicitação de orçamento"}
            </button>
            {submitError && (
              <p className={styles.error} role="alert">
                {submitError}
              </p>
            )}
            {sent && (
              <p className={styles.confirm} role="status">
                Solicitação recebida. Em breve retornaremos o contato com a
                proposta.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function PercentField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.percentField}>
      {label}
      <span className={styles.percentInput}>
        <input
          required
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(sanitizePercentInput(e.target.value))}
          placeholder="0"
        />
        <span aria-hidden="true">%</span>
      </span>
    </label>
  );
}
