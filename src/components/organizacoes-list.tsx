"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { criarOrganizacao } from "@/app/actions/organizacao";
import type { Tables } from "@/lib/supabase/types";

type OrgRow = Tables<"organizacao">;

const TIPO_LABEL: Record<string, string> = {
  interna: "Interna",
  cliente: "Cliente",
  fornecedor: "Fornecedor",
  outro: "Outro",
};

const TIPO_STYLE: Record<string, { bg: string; color: string }> = {
  interna:    { bg: "#DBEAFE", color: "#1D4ED8" },
  cliente:    { bg: "#D1FAE5", color: "#065F46" },
  fornecedor: { bg: "#FEF3C7", color: "#92400E" },
  outro:      { bg: "#F3F4F6", color: "#6B7280" },
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ativa:   { bg: "#DCFCE7", color: "#15803D" },
  inativa: { bg: "#F3F4F6", color: "#6B7280" },
};

export default function OrganizacoesList({ organizacoes }: { organizacoes: OrgRow[] }) {
  const [modal, setModal] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCriar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await criarOrganizacao(fd);
      if (res.erro) { setErro(res.erro); return; }
      setModal(false);
    });
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg-1">Organizações</h2>
        <button
          onClick={() => setModal(true)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
          style={{ background: "#3a1165" }}
          onMouseOver={e => (e.currentTarget.style.background = "#7C3AED")}
          onMouseOut={e => (e.currentTarget.style.background = "#3a1165")}
        >
          + Nova organização
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#E9DDF5" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F0FA" }}>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Nome</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Tipo</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Telefone</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">E-mail</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {organizacoes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-fg-3">
                  Nenhuma organização cadastrada
                </td>
              </tr>
            )}
            {organizacoes.map((o, i) => {
              const ts = TIPO_STYLE[o.tipo] ?? TIPO_STYLE.outro;
              const ss = STATUS_STYLE[o.status] ?? STATUS_STYLE.inativa;
              return (
                <tr
                  key={o.id}
                  className="border-t"
                  style={{ background: i % 2 === 0 ? "#FFFFFF" : "#faf5ff" }}
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/organizacoes/${o.id}`}
                      className="text-xs font-medium text-fg-1 underline-offset-2 hover:underline"
                    >
                      {o.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: ts.bg, color: ts.color }}
                    >
                      {TIPO_LABEL[o.tipo] ?? o.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-fg-2">{o.telefone ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-fg-2">{o.email ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: ss.bg, color: ss.color }}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl"
            style={{ background: "#FFF", borderColor: "#E9DDF5" }}
          >
            <h3 className="mb-4 text-sm font-semibold text-fg-1">Nova organização</h3>
            <form onSubmit={handleCriar} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Nome *</label>
                <input
                  name="nome"
                  required
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none focus:ring-1"
                  style={{ borderColor: "#E9DDF5" }}
                  placeholder="Ex.: Empresa Ltda"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Tipo *</label>
                <select
                  name="tipo"
                  required
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                >
                  <option value="">Selecione…</option>
                  <option value="interna">Interna</option>
                  <option value="cliente">Cliente</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-fg-3">Telefone</label>
                  <input
                    name="telefone"
                    className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: "#E9DDF5" }}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-fg-3">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: "#E9DDF5" }}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Site</label>
                <input
                  name="site"
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                  placeholder="https://empresa.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Observações</label>
                <textarea
                  name="observacoes"
                  rows={2}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              {erro && <p className="text-[11px] text-red-600">{erro}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-fg-3 hover:text-fg-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  style={{ background: "#3a1165" }}
                >
                  {isPending ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
