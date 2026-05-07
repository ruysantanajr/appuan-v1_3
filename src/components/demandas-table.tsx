"use client";

import { useState, useMemo, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import type { Tables } from "@/lib/supabase/types";
import { labelArea } from "@/lib/area-utils";
import { criarDemanda } from "@/app/actions/demanda";

type DemandaComArea = Tables<"demanda"> & {
  area: { nome: string; sigla: string; tipo: string } | null;
  criador: { nome: string } | null;
};

const LABEL_ORIGEM: Record<string, string> = {
  whatsapp:   "WhatsApp",
  email:      "E-mail",
  telefone:   "Telefone",
  presencial: "Presencial",
  interna:    "Interna",
  outra:      "Outra",
};

const ORIGENS = [
  { value: "whatsapp",   label: "WhatsApp" },
  { value: "email",      label: "E-mail" },
  { value: "telefone",   label: "Telefone" },
  { value: "presencial", label: "Presencial" },
  { value: "interna",    label: "Interna" },
  { value: "outra",      label: "Outra" },
];

const STATUS_OPTIONS = [
  { value: "ativas",        label: "Ativas" },
  { value: "",              label: "Todos os status" },
  { value: "nova",          label: "Nova" },
  { value: "em tratamento", label: "Em tratamento" },
  { value: "convertida",    label: "Convertida" },
  { value: "descartada",    label: "Descartada" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  nova:             { bg: "#DBEAFE", color: "#1D4ED8" },
  "em tratamento":  { bg: "#FEF3C7", color: "#B45309" },
  convertida:       { bg: "#DCFCE7", color: "#15803D" },
  descartada:       { bg: "#FEE2E2", color: "#B91C1C" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadBlob(content: string, filename: string, mime: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + content], { type: mime }));
  a.download = filename;
  a.click();
}

export default function DemandasTable({
  demandas,
  areas,
}: {
  demandas: DemandaComArea[];
  areas: { id: string; nome: string; sigla: string; tipo: string }[];
}) {
  const router = useRouter();

  // Filtros
  const [filtroStatus, setFiltroStatus] = useState("ativas");
  const [filtroArea,   setFiltroArea]   = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [busca,        setBusca]        = useState("");
  const [dataInicio,   setDataInicio]   = useState("");
  const [dataFim,      setDataFim]      = useState("");

  // Modal nova demanda
  const [showModal,  setShowModal]   = useState(false);
  const [formErro,   setFormErro]    = useState<string | null>(null);
  const [isPending,  startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const filtradas = useMemo(() => {
    return demandas.filter(d => {
      if (filtroStatus === "ativas") {
        if (d.status !== "nova" && d.status !== "em tratamento") return false;
      } else if (filtroStatus) {
        if (d.status !== filtroStatus) return false;
      }
      if (filtroArea   && d.area_id !== filtroArea)   return false;
      if (filtroOrigem && d.origem  !== filtroOrigem) return false;
      if (busca && !d.descricao.toLowerCase().includes(busca.toLowerCase())) return false;
      if (dataInicio) {
        const inicio = new Date(dataInicio + "T00:00:00");
        if (new Date(d.criado_em) < inicio) return false;
      }
      if (dataFim) {
        const fim = new Date(dataFim + "T23:59:59");
        if (new Date(d.criado_em) > fim) return false;
      }
      return true;
    });
  }, [demandas, filtroStatus, filtroArea, filtroOrigem, busca, dataInicio, dataFim]);

  // ── Exportação ────────────────────────────────────────────────

  function exportCSV() {
    const headers = ["Data de Registro", "Descrição", "Área", "Origem", "Status", "Criado por"];
    const rows = filtradas.map(d => [
      fmt(d.criado_em),
      d.descricao,
      labelArea(d.area),
      LABEL_ORIGEM[d.origem] ?? d.origem,
      d.status,
      d.criador?.nome ?? "—",
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadBlob(csv, "demandas.csv", "text/csv;charset=utf-8;");
  }

  function exportXLS() {
    const data = filtradas.map(d => ({
      "Data de Registro": fmt(d.criado_em),
      "Descrição":        d.descricao,
      "Área":             labelArea(d.area),
      "Origem":           LABEL_ORIGEM[d.origem] ?? d.origem,
      "Status":           d.status,
      "Criado por":       d.criador?.nome ?? "—",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Demandas");
    XLSX.writeFile(wb, "demandas.xlsx");
  }

  // ── Submit nova demanda ───────────────────────────────────────

  function handleNovaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErro(null);
    const fd = new FormData(e.currentTarget);
    if (!fd.get("descricao")) { setFormErro("Descrição obrigatória."); return; }
    if (!fd.get("area_id"))   { setFormErro("Selecione uma área."); return; }
    if (!fd.get("origem"))    { setFormErro("Selecione a origem."); return; }

    startTransition(async () => {
      const res = await criarDemanda(fd);
      if (res.erro) {
        setFormErro(res.erro);
      } else {
        setShowModal(false);
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  // ── Estilos compartilhados ────────────────────────────────────

  const inputStyle = { borderColor: "#E9DDF5", background: "#FFFFFF" };
  const btnOutline = { borderColor: "#E9DDF5", background: "#FFFFFF", color: "#4B3A66" };

  return (
    <>
      {/* Print CSS — complementar ao globals.css */}
      <style>{`
        .print-header { display: none; }
        @media print {
          .print-header {
            display: flex !important;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #3a1165;
          }
          .print-header h1 { font-size: 14pt; font-weight: 700; color: #1F1230; }
          .print-header span { font-size: 8pt; color: #7A6B8E; }
        }
      `}</style>

      <div className="flex flex-col gap-4">
        {/* Cabeçalho visível só na impressão */}
        <div className="print-header">
          <h1>Demandas</h1>
          <span suppressHydrationWarning>Gerado em {new Date().toLocaleString("pt-BR")}</span>
        </div>

        {/* ── Toolbar ──────────────────────────────────────── */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => { setFormErro(null); setShowModal(true); }}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ background: "#3a1165" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#7C3AED")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#3a1165")}
          >
            + Nova Demanda
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => window.print()}
              className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
              style={btnOutline}
              title="Imprimir ou salvar como PDF"
            >
              🖨 Imprimir / PDF
            </button>
            <button
              onClick={exportCSV}
              className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
              style={btnOutline}
            >
              ↓ CSV
            </button>
            <button
              onClick={exportXLS}
              className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
              style={btnOutline}
            >
              ↓ XLS
            </button>
          </div>
        </div>

        {/* ── Filtros — linha 1 ─────────────────────────── */}
        <div className="no-print flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 placeholder:text-fg-disabled focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={{ ...inputStyle, minWidth: "160px" }}
          />
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={inputStyle}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={filtroArea}
            onChange={e => setFiltroArea(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={inputStyle}
          >
            <option value="">Todas as áreas</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{labelArea(a)} — {a.nome}</option>
            ))}
          </select>
          <select
            value={filtroOrigem}
            onChange={e => setFiltroOrigem(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={inputStyle}
          >
            <option value="">Todas as origens</option>
            {Object.entries(LABEL_ORIGEM).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* ── Filtros — linha 2: período ────────────────── */}
        <div className="no-print flex flex-wrap items-center gap-2">
          <span className="text-xs text-fg-3">Período:</span>
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={inputStyle}
          />
          <span className="text-xs text-fg-3">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            min={dataInicio || undefined}
            className="rounded-md border px-3 py-1.5 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={inputStyle}
          />
          {(dataInicio || dataFim) && (
            <button
              onClick={() => { setDataInicio(""); setDataFim(""); }}
              className="rounded-md px-2 py-1.5 text-xs text-fg-3 hover:text-fg-1"
              style={{ borderColor: "#E9DDF5" }}
            >
              ✕ Limpar
            </button>
          )}
          <span className="ml-auto text-xs text-fg-3">
            {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Tabela ────────────────────────────────────── */}
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "#E9DDF5" }}
        >
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr style={{ background: "#F5F0FA" }}>
                <th className="w-40 px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Data de Registro
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Descrição
                </th>
                <th className="w-28 px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Área
                </th>
                <th className="w-28 px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Origem
                </th>
                <th className="w-32 px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Status
                </th>
                <th className="w-32 px-4 py-2.5 text-left text-xs font-semibold text-fg-3">
                  Criado por
                </th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-fg-3">
                    Nenhuma demanda encontrada.
                  </td>
                </tr>
              ) : (
                filtradas.map((d, i) => {
                  const st = STATUS_STYLE[d.status] ?? { bg: "#F3F4F6", color: "#6B7280" };
                  return (
                    <tr
                      key={d.id}
                      style={{ background: i % 2 === 0 ? "#FFFFFF" : "#faf5ff" }}
                      className="border-t hover:bg-bg-hover"
                      onMouseEnter={e => (e.currentTarget.style.background = "#F5F0FA")}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#FFFFFF" : "#faf5ff")}
                    >
                      <td className="px-4 py-2.5 text-xs text-fg-3">
                        {fmt(d.criado_em)}
                      </td>
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/demandas/${d.id}`}
                          className="block truncate text-xs text-fg-1 hover:text-accent hover:underline"
                        >
                          {d.descricao}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-fg-2">
                        {labelArea(d.area)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-fg-2">
                        {LABEL_ORIGEM[d.origem] ?? d.origem}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-fg-2">
                        {d.criador?.nome ?? "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Nova Demanda ──────────────────────────────────── */}
      {showModal && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(23,0,36,0.45)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="w-full max-w-lg rounded-lg border p-6"
            style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
          >
            <h2 className="mb-5 text-sm font-semibold text-fg-1">Nova Demanda</h2>

            <form ref={formRef} onSubmit={handleNovaSubmit} className="flex flex-col gap-4">
              {/* Descrição */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-descricao" className="text-xs font-medium text-fg-2">
                  Descrição
                </label>
                <textarea
                  id="modal-descricao"
                  name="descricao"
                  rows={4}
                  placeholder="Descreva a demanda..."
                  className="w-full resize-none rounded-md border px-3 py-2 text-sm text-fg-1 placeholder:text-fg-disabled focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                  style={inputStyle}
                  disabled={isPending}
                />
              </div>

              <div className="flex gap-3">
                {/* Área */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="modal-area" className="text-xs font-medium text-fg-2">
                    Área
                  </label>
                  <select
                    id="modal-area"
                    name="area_id"
                    defaultValue=""
                    className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                    style={inputStyle}
                    disabled={isPending}
                  >
                    <option value="" disabled>Selecione...</option>
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>
                        {labelArea(a)} — {a.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Origem */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="modal-origem" className="text-xs font-medium text-fg-2">
                    Origem
                  </label>
                  <select
                    id="modal-origem"
                    name="origem"
                    defaultValue=""
                    className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
                    style={inputStyle}
                    disabled={isPending}
                  >
                    <option value="" disabled>Selecione...</option>
                    {ORIGENS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formErro && (
                <p className="rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">
                  {formErro}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t pt-4" style={{ borderColor: "#E9DDF5" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                  style={{ background: "#F3F4F6", color: "#4B3A66" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
                  style={{ background: isPending ? "#7A6B8E" : "#3a1165" }}
                  onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#7C3AED"; }}
                  onMouseLeave={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#3a1165"; }}
                >
                  {isPending ? "Registrando..." : "Registrar demanda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
