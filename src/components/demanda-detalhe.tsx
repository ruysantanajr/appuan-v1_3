"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  atualizarStatusDemanda,
  atualizarDemanda,
  converterDemandaEmRequisicao,
} from "@/app/actions/demanda";
import type { Tables } from "@/lib/supabase/types";
import { labelArea } from "@/lib/area-utils";

type Demanda = Tables<"demanda"> & {
  area:    { id: string; nome: string; sigla: string; tipo: string } | null;
  criador: { nome: string } | null;
  editor:  { nome: string } | null;
};

type Fluxo = Tables<"fluxo"> & { etapas: Tables<"etapa">[] };
type Area  = { id: string; nome: string; sigla: string; tipo: string };

const LABEL_ORIGEM: Record<string, string> = {
  whatsapp:   "WhatsApp",
  email:      "E-mail",
  telefone:   "Telefone",
  presencial: "Presencial",
  interna:    "Interna",
  outra:      "Outra",
};

const ORIGENS = Object.entries(LABEL_ORIGEM).map(([value, label]) => ({ value, label }));

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  nova:             { bg: "#DBEAFE", color: "#1D4ED8" },
  "em tratamento":  { bg: "#FEF3C7", color: "#B45309" },
  convertida:       { bg: "#DCFCE7", color: "#15803D" },
  descartada:       { bg: "#FEE2E2", color: "#B91C1C" },
};

const OPERACAO_LABEL: Record<string, string> = {
  insert: "Criação",
  update: "Atualização",
  delete: "Exclusão",
};

const CAMPO_LABEL: Record<string, string> = {
  descricao: "Descrição",
  status:    "Status",
  origem:    "Origem",
  area_id:   "Área",
};

// Campos internos que não precisam aparecer no diff
const CAMPOS_OCULTOS = new Set([
  "id", "criado_em", "atualizado_em", "criado_por", "atualizado_por",
]);

function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatValor(campo: string, valor: unknown, areas: Area[]): string {
  if (valor === null || valor === undefined) return "—";
  if (campo === "origem")  return LABEL_ORIGEM[valor as string] ?? String(valor);
  if (campo === "status")  return String(valor);
  if (campo === "area_id") {
    const a = areas.find(a => a.id === valor);
    return a ? (a.tipo === "pessoal" ? "Pessoal" : `${a.sigla} — ${a.nome}`) : String(valor);
  }
  const s = String(valor);
  return s.length > 100 ? s.slice(0, 100) + "…" : s;
}

type Mudanca = { campo: string; label: string; antes: string; depois: string };

function calcMudancas(
  antes: Record<string, unknown> | null,
  depois: Record<string, unknown> | null,
  areas: Area[]
): Mudanca[] {
  if (!depois) return [];
  const campos = Object.keys(CAMPO_LABEL);

  // INSERT: mostra valores iniciais
  if (!antes) {
    return campos
      .filter(c => depois[c] !== null && depois[c] !== undefined)
      .map(c => ({
        campo:  c,
        label:  CAMPO_LABEL[c],
        antes:  "",
        depois: formatValor(c, depois[c], areas),
      }));
  }

  // UPDATE: mostra só o que mudou
  return campos
    .filter(c => !CAMPOS_OCULTOS.has(c) && String(antes[c]) !== String(depois[c]))
    .map(c => ({
      campo:  c,
      label:  CAMPO_LABEL[c],
      antes:  formatValor(c, antes[c], areas),
      depois: formatValor(c, depois[c], areas),
    }));
}

/* ── Campo somente-leitura ─────────────────────────────────── */
function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-fg-3">{label}</span>
      <div className="text-sm text-fg-1">{children || "—"}</div>
    </div>
  );
}

/* ── Modal reutilizável ────────────────────────────────────── */
function Modal({
  titulo, children, onClose,
}: { titulo: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(23,0,36,0.4)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-lg border p-6"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}>
        <h3 className="mb-4 text-sm font-semibold text-fg-1">{titulo}</h3>
        {children}
      </div>
    </div>
  );
}

/* ── Entrada do histórico ──────────────────────────────────── */
function TrilhaItem({
  t, areas,
}: { t: Tables<"trilha_auditoria">; areas: Area[] }) {
  const [aberto, setAberto] = useState(false);

  const antes  = t.dados_antes  as Record<string, unknown> | null;
  const depois = t.dados_depois as Record<string, unknown> | null;
  const mudancas = calcMudancas(antes, depois, areas);
  const isInsert = t.operacao === "insert";

  const opLabel = OPERACAO_LABEL[t.operacao] ?? t.operacao;
  const opStyle = isInsert
    ? { background: "#DCFCE7", color: "#15803D" }
    : { background: "#F5F0FA", color: "#4B3A66" };

  return (
    <li className="rounded-md border text-xs" style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}>
      {/* Linha principal */}
      <button
        type="button"
        onClick={() => mudancas.length > 0 && setAberto(v => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        style={{ cursor: mudancas.length > 0 ? "pointer" : "default" }}
      >
        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase" style={opStyle}>
          {opLabel}
        </span>
        <span className="text-fg-3">{fmt(t.criado_em)}</span>
        {mudancas.length > 0 && (
          <span className="ml-auto text-fg-disabled">{aberto ? "▲" : "▼"}</span>
        )}
      </button>

      {/* Diff expandível */}
      {aberto && mudancas.length > 0 && (
        <div
          className="flex flex-col gap-3 border-t px-4 py-3"
          style={{ borderColor: "#F0EAF8", background: "#FAFAF7" }}
        >
          {mudancas.map(m => (
            <div key={m.campo}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-3">
                {m.label}
              </p>
              {isInsert ? (
                <p className="text-fg-1">{m.depois}</p>
              ) : m.campo === "descricao" ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-red-100 bg-red-50 p-2">
                    <p className="mb-1 text-[9px] font-semibold uppercase text-red-500">Antes</p>
                    <p className="text-fg-2 leading-relaxed">{m.antes}</p>
                  </div>
                  <div className="rounded border border-green-100 bg-green-50 p-2">
                    <p className="mb-1 text-[9px] font-semibold uppercase text-green-600">Depois</p>
                    <p className="text-fg-2 leading-relaxed">{m.depois}</p>
                  </div>
                </div>
              ) : (
                <p>
                  <span className="text-fg-3 line-through">{m.antes}</span>
                  <span className="mx-1.5 text-fg-disabled">→</span>
                  <span className="font-medium text-fg-1">{m.depois}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

/* ══════════════════════════════════════════════════════════════
   Componente principal
══════════════════════════════════════════════════════════════ */
export default function DemandaDetalhe({
  demanda, fluxos, trilha, areas,
}: {
  demanda: Demanda;
  fluxos:  Fluxo[];
  trilha:  Tables<"trilha_auditoria">[];
  areas:   Area[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<"converter" | "descartar" | null>(null);
  const [erro,  setErro]  = useState<string | null>(null);

  const editando = demanda.status === "em tratamento";
  const [descricao, setDescricao] = useState(demanda.descricao);
  const [areaId,    setAreaId]    = useState(demanda.area_id ?? "");
  const [origem,    setOrigem]    = useState(demanda.origem  ?? "");

  // Modal Converter
  const [titulo,   setTitulo]   = useState(demanda.descricao.slice(0, 80));
  const [fluxoId,  setFluxoId]  = useState(fluxos[0]?.id ?? "");
  const [etapaId,  setEtapaId]  = useState(fluxos[0]?.etapas[0]?.id ?? "");
  const [descConv, setDescConv] = useState("");

  const fluxoSel = fluxos.find(f => f.id === fluxoId);
  const etapas   = fluxoSel?.etapas ?? [];
  const inativo  = ["convertida", "descartada"].includes(demanda.status);
  const st       = STATUS_STYLE[demanda.status] ?? { bg: "#F3F4F6", color: "#6B7280" };

  const inputStyle = { borderColor: "#E9DDF5", background: "#FFFFFF" };
  const btnBase    = "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

  function labelOpcaoArea(a: Area): string {
    return a.tipo === "pessoal" ? "Pessoal" : `${a.sigla} — ${a.nome}`;
  }

  // ── Handlers ────────────────────────────────────────────────

  function handleIniciarTratamento() {
    setErro(null);
    startTransition(async () => {
      const res = await atualizarStatusDemanda(demanda.id, "em tratamento", demanda as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      router.refresh();
    });
  }

  function handleSalvar() {
    setErro(null);
    if (!descricao.trim()) { setErro("Descrição obrigatória."); return; }
    if (!areaId)            { setErro("Selecione uma área."); return; }
    if (!origem)            { setErro("Selecione a origem."); return; }
    startTransition(async () => {
      const res = await atualizarDemanda(demanda.id, { descricao: descricao.trim(), area_id: areaId, origem }, demanda as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      router.refresh();
    });
  }

  function handleFluxoChange(id: string) {
    setFluxoId(id);
    const f = fluxos.find(f => f.id === id);
    setEtapaId(f?.etapas[0]?.id ?? "");
  }

  function handleConverter() {
    setErro(null);
    if (!titulo.trim()) { setErro("Título obrigatório."); return; }
    if (!fluxoId)       { setErro("Selecione um fluxo."); return; }
    if (!etapaId)       { setErro("Selecione a etapa inicial."); return; }
    startTransition(async () => {
      const res = await converterDemandaEmRequisicao(
        demanda.id,
        { titulo: titulo.trim(), area_id: demanda.area_id, fluxo_id: fluxoId, etapa_id: etapaId, descricao: descConv || undefined },
        demanda as Record<string, unknown>
      );
      if (res.erro) { setErro(res.erro); return; }
      setModal(null);
      router.push("/demandas");
    });
  }

  function handleDescartar() {
    setErro(null);
    startTransition(async () => {
      const res = await atualizarStatusDemanda(demanda.id, "descartada", demanda as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      setModal(null);
      router.refresh();
    });
  }

  // ── Render ──────────────────────────────────────────────────

  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-xl border" style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}>

          {/* Status bar */}
          <div className="flex items-center justify-between border-b px-6 py-3"
            style={{ borderColor: "#E9DDF5", background: "#FAFAF7" }}>
            <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
              style={{ background: st.bg, color: st.color }}>
              {demanda.status}
            </span>
            {inativo && <span className="text-xs italic text-fg-3">Demanda encerrada</span>}
          </div>

          {/* Corpo */}
          <div className="flex flex-col gap-6 p-6">

            {/* Descrição */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-fg-3">Descrição</span>
              {editando ? (
                <textarea rows={4} value={descricao} onChange={e => setDescricao(e.target.value)}
                  className="w-full resize-none rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                  style={inputStyle} disabled={isPending} />
              ) : (
                <p className="text-sm leading-relaxed text-fg-1">{demanda.descricao}</p>
              )}
            </div>

            {/* Área + Origem */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-fg-3">Área</span>
                {editando ? (
                  <select value={areaId} onChange={e => setAreaId(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                    style={inputStyle} disabled={isPending}>
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>{labelOpcaoArea(a)}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-fg-1">
                    {demanda.area?.tipo === "pessoal"
                      ? "Pessoal"
                      : demanda.area ? `${demanda.area.sigla} — ${demanda.area.nome}` : "—"}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-fg-3">Origem</span>
                {editando ? (
                  <select value={origem} onChange={e => setOrigem(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                    style={inputStyle} disabled={isPending}>
                    {ORIGENS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-fg-1">{LABEL_ORIGEM[demanda.origem] ?? demanda.origem}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#F0EAF8" }} />

            {/* Metadados */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Campo label="Data de Registro">{fmt(demanda.criado_em)}</Campo>
              <Campo label="Última Atualização">{fmt(demanda.atualizado_em)}</Campo>
              <Campo label="Criado por">{demanda.criador?.nome ?? "—"}</Campo>
              <Campo label="Editado por">{demanda.editor?.nome ?? "—"}</Campo>
            </div>

            {/* Erro */}
            {erro && (
              <p className="rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">{erro}</p>
            )}

            {/* ── Botões de ação ────────────────────────── */}
            {!inativo && (
              <div className="flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "#E9DDF5" }}>
                {demanda.status === "nova" && (
                  <>
                    <button onClick={handleIniciarTratamento} disabled={isPending}
                      className={btnBase + " text-white"}
                      style={{ background: "#3a1165" }}
                      onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#7C3AED"; }}
                      onMouseLeave={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#3a1165"; }}>
                      {isPending ? "Aguarde..." : "Iniciar Tratamento"}
                    </button>
                    <button onClick={() => { setErro(null); setModal("descartar"); }} disabled={isPending}
                      className={btnBase}
                      style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                      Descartar
                    </button>
                  </>
                )}

                {demanda.status === "em tratamento" && (
                  <>
                    {/* PRIMARY — Converter */}
                    <button onClick={() => { setErro(null); setModal("converter"); }} disabled={isPending}
                      className={btnBase + " text-white"}
                      style={{ background: "#3a1165" }}
                      onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#7C3AED"; }}
                      onMouseLeave={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#3a1165"; }}>
                      Converter em Requisição
                    </button>
                    {/* SECONDARY — Salvar */}
                    <button onClick={handleSalvar} disabled={isPending}
                      className={btnBase}
                      style={{ background: "#F5F0FA", color: "#3a1165", border: "1.5px solid #C4A8E8" }}>
                      {isPending ? "Salvando..." : "Salvar"}
                    </button>
                    <button onClick={() => { setErro(null); setModal("descartar"); }} disabled={isPending}
                      className={btnBase}
                      style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                      Descartar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Histórico ──────────────────────────────────────── */}
        {trilha.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-fg-3">
              Histórico
            </h3>
            <ul className="flex flex-col gap-2">
              {trilha.map(t => (
                <TrilhaItem key={t.id} t={t} areas={areas} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Modal Converter ─────────────────────────────────── */}
      {modal === "converter" && (
        <Modal titulo="Converter em Requisição" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Título</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={inputStyle} disabled={isPending} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Fluxo</label>
              <select value={fluxoId} onChange={e => handleFluxoChange(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={inputStyle} disabled={isPending}>
                {fluxos.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Etapa inicial</label>
              <select value={etapaId} onChange={e => setEtapaId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={inputStyle} disabled={isPending}>
                {etapas.sort((a, b) => a.ordem - b.ordem).map(e => (
                  <option key={e.id} value={e.id}>{e.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">
                Descrição adicional <span className="font-normal text-fg-disabled">(opcional)</span>
              </label>
              <textarea rows={2} value={descConv} onChange={e => setDescConv(e.target.value)}
                className="w-full resize-none rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={inputStyle} disabled={isPending} />
            </div>
            {erro && <p className="rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">{erro}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setModal(null)} disabled={isPending} className={btnBase}
                style={{ background: "#F3F4F6", color: "#4B3A66" }}>Cancelar</button>
              <button onClick={handleConverter} disabled={isPending} className={btnBase + " text-white"}
                style={{ background: "#3a1165" }}>
                {isPending ? "Convertendo..." : "Confirmar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal Descartar ──────────────────────────────────── */}
      {modal === "descartar" && (
        <Modal titulo="Descartar demanda" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm text-fg-2">
            Tem certeza que deseja descartar esta demanda? Ela continuará visível no histórico.
          </p>
          {erro && <p className="mb-3 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">{erro}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={() => setModal(null)} disabled={isPending} className={btnBase}
              style={{ background: "#F3F4F6", color: "#4B3A66" }}>Cancelar</button>
            <button onClick={handleDescartar} disabled={isPending} className={btnBase + " text-white"}
              style={{ background: "#B91C1C" }}>
              {isPending ? "Descartando..." : "Descartar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
