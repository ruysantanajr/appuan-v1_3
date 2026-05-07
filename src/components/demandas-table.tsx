"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";
import { labelArea } from "@/lib/area-utils";

type DemandaComArea = Tables<"demanda"> & {
  area: { nome: string; sigla: string; tipo: string } | null;
};

const LABEL_ORIGEM: Record<string, string> = {
  whatsapp:   "WhatsApp",
  email:      "E-mail",
  telefone:   "Telefone",
  presencial: "Presencial",
  interna:    "Interna",
  outra:      "Outra",
};

const STATUS_OPTIONS = [
  { value: "",             label: "Todos os status" },
  { value: "nova",         label: "Nova" },
  { value: "em tratamento",label: "Em tratamento" },
  { value: "convertida",   label: "Convertida" },
  { value: "descartada",   label: "Descartada" },
];

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

export default function DemandasTable({
  demandas,
  areas,
}: {
  demandas: DemandaComArea[];
  areas: { id: string; nome: string; sigla: string; tipo: string }[];
}) {
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroArea, setFiltroArea]     = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [busca, setBusca]               = useState("");

  const filtradas = useMemo(() => {
    return demandas.filter(d => {
      if (filtroStatus && d.status !== filtroStatus) return false;
      if (filtroArea   && d.area_id !== filtroArea)  return false;
      if (filtroOrigem && d.origem  !== filtroOrigem) return false;
      if (busca && !d.descricao.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [demandas, filtroStatus, filtroArea, filtroOrigem, busca]);

  const inputStyle = {
    borderColor: "#E9DDF5",
    background: "#FFFFFF",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
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
        <span className="ml-auto self-center text-xs text-fg-3">
          {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabela */}
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
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-fg-3">
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
