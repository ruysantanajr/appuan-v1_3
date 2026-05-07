"use client";

import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

type Requisicao = Tables<"requisicao"> & {
  area: { sigla: string; nome: string } | null;
  responsavel: { nome: string } | null;
};

const COLUNAS: { status: string; label: string; cor: string }[] = [
  { status: "em fila",      label: "Em fila",       cor: "#1D4ED8" },
  { status: "em andamento", label: "Em andamento",  cor: "#B45309" },
  { status: "aguardando",   label: "Aguardando",    cor: "#6B21A8" },
  { status: "concluida",    label: "Concluída",     cor: "#15803D" },
  { status: "cancelada",    label: "Cancelada",     cor: "#B91C1C" },
];

const HEADER_BG: Record<string, string> = {
  "em fila":      "#DBEAFE",
  "em andamento": "#FEF3C7",
  aguardando:     "#F3E8FF",
  concluida:      "#DCFCE7",
  cancelada:      "#FEE2E2",
};

function prazoLabel(prazo: string | null): { texto: string; urgente: boolean } | null {
  if (!prazo) return null;
  const hoje = new Date();
  const data = new Date(prazo + "T00:00:00");
  const diff = Math.ceil((data.getTime() - hoje.getTime()) / 86400000);
  if (diff < 0) return { texto: `${Math.abs(diff)}d atrasada`, urgente: true };
  if (diff === 0) return { texto: "hoje", urgente: true };
  if (diff === 1) return { texto: "amanhã", urgente: true };
  return {
    texto: data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    urgente: false,
  };
}

function CardRequisicao({ req }: { req: Requisicao }) {
  const prazo = prazoLabel(req.prazo);
  return (
    <Link
      href={`/kanban/${req.id}`}
      className="block rounded-md border p-3 text-xs transition-shadow hover:shadow-md"
      style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <span className="font-mono text-[10px] text-fg-3">{req.numero}</span>
        {req.area && (
          <span className="text-[10px] text-fg-3">{req.area.sigla?.trim()}</span>
        )}
      </div>
      <p className="mb-2 font-medium text-fg-1 leading-snug line-clamp-2">
        {req.titulo}
      </p>
      <div className="flex items-center justify-between gap-1">
        <span className="text-fg-3 truncate">
          {req.responsavel?.nome ?? "—"}
        </span>
        {prazo && (
          <span
            className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: prazo.urgente ? "#FEE2E2" : "#F3F4F6",
              color:      prazo.urgente ? "#B91C1C" : "#6B7280",
            }}
          >
            {prazo.texto}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function KanbanBoard({ requisicoes }: { requisicoes: Requisicao[] }) {
  const porStatus = (status: string) =>
    requisicoes.filter(r => r.status === status);

  return (
    <div className="flex h-full gap-4 overflow-x-auto px-6 py-6">
      {COLUNAS.map(col => {
        const cards = porStatus(col.status);
        const headerBg = HEADER_BG[col.status] ?? "#F3F4F6";
        return (
          <div
            key={col.status}
            className="flex w-64 flex-shrink-0 flex-col rounded-lg border overflow-hidden"
            style={{ borderColor: "#E9DDF5" }}
          >
            {/* Cabeçalho da coluna */}
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{ background: headerBg }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: col.cor }}
              >
                {col.label}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ background: col.cor, color: "#FFFFFF" }}
              >
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
              style={{ background: "#F5F0FA", minHeight: "200px" }}
            >
              {cards.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-[10px] text-fg-disabled">Vazio</span>
                </div>
              ) : (
                cards.map(r => <CardRequisicao key={r.id} req={r} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
