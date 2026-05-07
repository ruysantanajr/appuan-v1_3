"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { criarContato } from "@/app/actions/contato";
import type { Tables } from "@/lib/supabase/types";

type ContatoComOrg = Tables<"contato"> & {
  organizacao: { id: string; nome: string } | null;
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: "#DCFCE7", color: "#15803D" },
  inativo: { bg: "#F3F4F6", color: "#6B7280" },
};

export default function ContatosList({
  contatos,
  organizacoes,
}: {
  contatos: ContatoComOrg[];
  organizacoes: { id: string; nome: string }[];
}) {
  const [modal, setModal] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCriar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await criarContato(fd);
      if (res.erro) { setErro(res.erro); return; }
      setModal(false);
    });
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg-1">Contatos</h2>
        <button
          onClick={() => setModal(true)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors"
          style={{ background: "#3a1165" }}
          onMouseOver={e => (e.currentTarget.style.background = "#7C3AED")}
          onMouseOut={e => (e.currentTarget.style.background = "#3a1165")}
        >
          + Novo contato
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "#E9DDF5" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F0FA" }}>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Nome</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Organização</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Cargo</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Telefone</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">E-mail</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {contatos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-fg-3">
                  Nenhum contato cadastrado
                </td>
              </tr>
            )}
            {contatos.map((c, i) => {
              const ss = STATUS_STYLE[c.status] ?? STATUS_STYLE.inativo;
              return (
                <tr
                  key={c.id}
                  className="border-t"
                  style={{ background: i % 2 === 0 ? "#FFFFFF" : "#faf5ff" }}
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/contatos/${c.id}`}
                      className="text-xs font-medium text-fg-1 underline-offset-2 hover:underline"
                    >
                      {c.nome}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-fg-2">
                    {c.organizacao ? (
                      <Link
                        href={`/organizacoes/${c.organizacao.id}`}
                        className="hover:underline"
                      >
                        {c.organizacao.nome}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-fg-3">{c.cargo ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-fg-2">{c.telefone ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-fg-2">{c.email ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: ss.bg, color: ss.color }}
                    >
                      {c.status}
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
            <h3 className="mb-4 text-sm font-semibold text-fg-1">Novo contato</h3>
            <form onSubmit={handleCriar} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Nome *</label>
                <input
                  name="nome"
                  required
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Organização</label>
                <select
                  name="organizacao_id"
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                >
                  <option value="">Nenhuma</option>
                  {organizacoes.map(o => (
                    <option key={o.id} value={o.id}>{o.nome}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-fg-3">Cargo</label>
                  <input
                    name="cargo"
                    className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: "#E9DDF5" }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-fg-3">Telefone</label>
                  <input
                    name="telefone"
                    className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: "#E9DDF5" }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[11px] text-fg-3">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                    style={{ borderColor: "#E9DDF5" }}
                  />
                </div>
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
