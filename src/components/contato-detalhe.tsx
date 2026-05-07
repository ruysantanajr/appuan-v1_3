"use client";

import { useState, useTransition } from "react";
import { atualizarContato, alterarStatusContato } from "@/app/actions/contato";
import type { Tables } from "@/lib/supabase/types";

type ContatoComOrg = Tables<"contato"> & {
  organizacao: { id: string; nome: string } | null;
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] text-fg-3">{label}</p>
      <p className="mt-0.5 text-xs text-fg-1">{value || "—"}</p>
    </div>
  );
}

export default function ContatoDetalhe({
  contato,
  organizacoes,
  trilha,
}: {
  contato: ContatoComOrg;
  organizacoes: { id: string; nome: string }[];
  trilha: Tables<"trilha_auditoria">[];
}) {
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSalvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await atualizarContato(contato.id, fd, contato as unknown as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      setEditando(false);
    });
  }

  function handleAlterarStatus() {
    const novoStatus = contato.status === "ativo" ? "inativo" : "ativo";
    startTransition(async () => {
      await alterarStatusContato(contato.id, novoStatus, contato as unknown as Record<string, unknown>);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div
        className="mb-6 rounded-lg border p-6"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-fg-1">{contato.nome}</h2>
            {contato.cargo && (
              <p className="mt-0.5 text-xs text-fg-3">{contato.cargo}</p>
            )}
            {contato.organizacao && (
              <p className="mt-0.5 text-xs text-fg-3">{contato.organizacao.nome}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={
                contato.status === "ativo"
                  ? { background: "#DCFCE7", color: "#15803D" }
                  : { background: "#F3F4F6", color: "#6B7280" }
              }
            >
              {contato.status}
            </span>
            <button
              onClick={() => setEditando(!editando)}
              className="rounded-md border px-3 py-1 text-xs text-fg-2 hover:text-fg-1"
              style={{ borderColor: "#E9DDF5" }}
            >
              {editando ? "Cancelar" : "Editar"}
            </button>
            <button
              onClick={handleAlterarStatus}
              disabled={isPending}
              className="rounded-md border px-3 py-1 text-xs text-fg-3 hover:text-fg-1 disabled:opacity-50"
              style={{ borderColor: "#E9DDF5" }}
            >
              {contato.status === "ativo" ? "Inativar" : "Ativar"}
            </button>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSalvar} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[11px] text-fg-3">Nome *</label>
              <input
                name="nome"
                required
                defaultValue={contato.nome}
                className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                style={{ borderColor: "#E9DDF5" }}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-fg-3">Organização</label>
              <select
                name="organizacao_id"
                defaultValue={contato.organizacao_id ?? ""}
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
                  defaultValue={contato.cargo ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Telefone</label>
                <input
                  name="telefone"
                  defaultValue={contato.telefone ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[11px] text-fg-3">E-mail</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={contato.email ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[11px] text-fg-3">Observações</label>
                <textarea
                  name="observacoes"
                  rows={3}
                  defaultValue={contato.observacoes ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
            </div>
            {erro && <p className="text-[11px] text-red-600">{erro}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditando(false)}
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
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefone" value={contato.telefone} />
            <Field label="E-mail" value={contato.email} />
            <Field label="Observações" value={contato.observacoes} />
          </div>
        )}
      </div>

      {trilha.length > 0 && (
        <div
          className="rounded-lg border"
          style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: "#E9DDF5" }}>
            <h3 className="text-xs font-semibold text-fg-1">Histórico</h3>
          </div>
          <ul>
            {trilha.map(t => (
              <li
                key={t.id}
                className="flex items-center gap-3 border-b px-4 py-2.5 last:border-0"
                style={{ borderColor: "#E9DDF5" }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ background: "#EDE9FE", color: "#6B21D4" }}
                >
                  {t.operacao}
                </span>
                <span className="text-[11px] text-fg-3">
                  {new Date(t.criado_em).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
