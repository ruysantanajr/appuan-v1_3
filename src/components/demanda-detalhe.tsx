"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  atualizarStatusDemanda,
  converterDemandaEmRequisicao,
} from "@/app/actions/demanda";
import type { Tables } from "@/lib/supabase/types";

type Demanda = Tables<"demanda"> & {
  area: { id: string; nome: string; sigla: string } | null;
};

type Fluxo = Tables<"fluxo"> & { etapas: Tables<"etapa">[] };

const LABEL_ORIGEM: Record<string, string> = {
  whatsapp:   "WhatsApp",
  email:      "E-mail",
  telefone:   "Telefone",
  presencial: "Presencial",
  interna:    "Interna",
  outra:      "Outra",
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  nova:             { bg: "#DBEAFE", color: "#1D4ED8" },
  "em tratamento":  { bg: "#FEF3C7", color: "#B45309" },
  convertida:       { bg: "#DCFCE7", color: "#15803D" },
  descartada:       { bg: "#F3F4F6", color: "#6B7280" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Modal({
  titulo,
  children,
  onClose,
}: {
  titulo: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(23,0,36,0.4)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-lg border p-6"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
      >
        <h3 className="mb-4 text-sm font-semibold text-fg-1">{titulo}</h3>
        {children}
      </div>
    </div>
  );
}

export default function DemandaDetalhe({
  demanda,
  fluxos,
  trilha,
}: {
  demanda: Demanda;
  fluxos: Fluxo[];
  trilha: Tables<"trilha_auditoria">[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<"converter" | "descartar" | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Converter form state
  const [titulo, setTitulo]       = useState(demanda.descricao.slice(0, 80));
  const [fluxoId, setFluxoId]     = useState(fluxos[0]?.id ?? "");
  const [etapaId, setEtapaId]     = useState(fluxos[0]?.etapas[0]?.id ?? "");
  const [descConv, setDescConv]   = useState("");

  const fluxoSel = fluxos.find(f => f.id === fluxoId);
  const etapas   = fluxoSel?.etapas ?? [];

  const inativo = ["convertida", "descartada"].includes(demanda.status);
  const st = STATUS_STYLE[demanda.status] ?? { bg: "#F3F4F6", color: "#6B7280" };

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
        {
          titulo:    titulo.trim(),
          area_id:   demanda.area_id,
          fluxo_id:  fluxoId,
          etapa_id:  etapaId,
          descricao: descConv || undefined,
        },
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
      const res = await atualizarStatusDemanda(
        demanda.id, "descartada", demanda as Record<string, unknown>
      );
      if (res.erro) { setErro(res.erro); return; }
      setModal(null);
      router.refresh();
    });
  }

  function handleEmTratamento() {
    startTransition(async () => {
      await atualizarStatusDemanda(
        demanda.id, "em tratamento", demanda as Record<string, unknown>
      );
      router.refresh();
    });
  }

  const btnBase =
    "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Cabeçalho do card */}
        <div
          className="rounded-lg border p-6"
          style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ background: st.bg, color: st.color }}
            >
              {demanda.status}
            </span>
            <span className="text-xs text-fg-3">
              {fmt(demanda.criado_em)}
            </span>
          </div>

          <p className="mb-6 text-sm text-fg-1 leading-relaxed">{demanda.descricao}</p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-fg-3">Área</span>
              <p className="font-medium text-fg-1">
                {demanda.area?.sigla?.trim()} — {demanda.area?.nome ?? "—"}
              </p>
            </div>
            <div>
              <span className="text-fg-3">Origem</span>
              <p className="font-medium text-fg-1">
                {LABEL_ORIGEM[demanda.origem] ?? demanda.origem}
              </p>
            </div>
            <div>
              <span className="text-fg-3">Atualizado em</span>
              <p className="font-medium text-fg-1">{fmt(demanda.atualizado_em)}</p>
            </div>
          </div>

          {/* Ações */}
          {!inativo && (
            <div className="mt-6 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "#E9DDF5" }}>
              {demanda.status === "nova" && (
                <button
                  onClick={handleEmTratamento}
                  disabled={isPending}
                  className={btnBase}
                  style={{ background: "#FEF3C7", color: "#B45309" }}
                >
                  Em tratamento
                </button>
              )}
              <button
                onClick={() => { setErro(null); setModal("converter"); }}
                disabled={isPending}
                className={btnBase + " text-white"}
                style={{ background: "#3a1165" }}
              >
                Converter em requisição
              </button>
              <button
                onClick={() => { setErro(null); setModal("descartar"); }}
                disabled={isPending}
                className={btnBase}
                style={{ background: "#FEE2E2", color: "#B91C1C" }}
              >
                Descartar
              </button>
            </div>
          )}
        </div>

        {/* Trilha de auditoria */}
        {trilha.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-3">
              Histórico
            </h3>
            <ul className="flex flex-col gap-2">
              {trilha.map(t => (
                <li
                  key={t.id}
                  className="flex items-start gap-3 rounded-md border px-4 py-3 text-xs"
                  style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
                >
                  <span className="flex-shrink-0 font-medium text-fg-2">
                    {t.operacao}
                  </span>
                  <span className="flex-1 text-fg-3 break-all">
                    {t.criado_em ? fmt(t.criado_em) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal — Converter */}
      {modal === "converter" && (
        <Modal titulo="Converter em requisição" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={{ borderColor: "#E9DDF5" }}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Fluxo</label>
              <select
                value={fluxoId}
                onChange={e => handleFluxoChange(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={{ borderColor: "#E9DDF5" }}
                disabled={isPending}
              >
                {fluxos.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">Etapa inicial</label>
              <select
                value={etapaId}
                onChange={e => setEtapaId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={{ borderColor: "#E9DDF5" }}
                disabled={isPending}
              >
                {etapas
                  .sort((a, b) => a.ordem - b.ordem)
                  .map(e => (
                    <option key={e.id} value={e.id}>{e.nome}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-2">
                Descrição adicional (opcional)
              </label>
              <textarea
                rows={2}
                value={descConv}
                onChange={e => setDescConv(e.target.value)}
                className="w-full resize-none rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                style={{ borderColor: "#E9DDF5" }}
                disabled={isPending}
              />
            </div>
            {erro && (
              <p className="rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">{erro}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                disabled={isPending}
                className={btnBase}
                style={{ background: "#F3F4F6", color: "#4B3A66" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConverter}
                disabled={isPending}
                className={btnBase + " text-white"}
                style={{ background: "#3a1165" }}
              >
                {isPending ? "Convertendo..." : "Confirmar"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal — Descartar */}
      {modal === "descartar" && (
        <Modal titulo="Descartar demanda" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm text-fg-2">
            Tem certeza que deseja descartar esta demanda? Ela continuará visível no histórico.
          </p>
          {erro && (
            <p className="mb-3 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">{erro}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              disabled={isPending}
              className={btnBase}
              style={{ background: "#F3F4F6", color: "#4B3A66" }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDescartar}
              disabled={isPending}
              className={btnBase + " text-white"}
              style={{ background: "#B91C1C" }}
            >
              {isPending ? "Descartando..." : "Descartar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
