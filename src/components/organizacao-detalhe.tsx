"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { atualizarOrganizacao, alterarStatusOrganizacao } from "@/app/actions/organizacao";
import type { Tables } from "@/lib/supabase/types";

type OrgRow = Tables<"organizacao">;
type ContatoRow = Tables<"contato">;

const TIPO_LABEL: Record<string, string> = {
  interna: "Interna", cliente: "Cliente", fornecedor: "Fornecedor", outro: "Outro",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] text-fg-3">{label}</p>
      <p className="mt-0.5 text-xs text-fg-1">{value || "—"}</p>
    </div>
  );
}

export default function OrganizacaoDetalhe({
  organizacao,
  contatos,
  trilha,
}: {
  organizacao: OrgRow;
  contatos: ContatoRow[];
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
      const res = await atualizarOrganizacao(organizacao.id, fd, organizacao as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      setEditando(false);
    });
  }

  function handleAlterarStatus() {
    const novoStatus = organizacao.status === "ativa" ? "inativa" : "ativa";
    startTransition(async () => {
      await alterarStatusOrganizacao(organizacao.id, novoStatus, organizacao as Record<string, unknown>);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div
        className="mb-6 rounded-lg border p-6"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-fg-1">{organizacao.nome}</h2>
            <p className="mt-0.5 text-xs text-fg-3">{TIPO_LABEL[organizacao.tipo] ?? organizacao.tipo}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={
                organizacao.status === "ativa"
                  ? { background: "#DCFCE7", color: "#15803D" }
                  : { background: "#F3F4F6", color: "#6B7280" }
              }
            >
              {organizacao.status}
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
              {organizacao.status === "ativa" ? "Inativar" : "Ativar"}
            </button>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSalvar} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Nome *</label>
                <input
                  name="nome"
                  required
                  defaultValue={organizacao.nome}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Tipo *</label>
                <select
                  name="tipo"
                  required
                  defaultValue={organizacao.tipo}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                >
                  <option value="interna">Interna</option>
                  <option value="cliente">Cliente</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Telefone</label>
                <input
                  name="telefone"
                  defaultValue={organizacao.telefone ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">E-mail</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={organizacao.email ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[11px] text-fg-3">Site</label>
                <input
                  name="site"
                  defaultValue={organizacao.site ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[11px] text-fg-3">Observações</label>
                <textarea
                  name="observacoes"
                  rows={3}
                  defaultValue={organizacao.observacoes ?? ""}
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
            <Field label="Telefone" value={organizacao.telefone} />
            <Field label="E-mail" value={organizacao.email} />
            <Field label="Site" value={organizacao.site} />
            <Field label="Observações" value={organizacao.observacoes} />
          </div>
        )}
      </div>

      {/* Contatos */}
      <div
        className="mb-6 rounded-lg border"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#E9DDF5" }}>
          <h3 className="text-xs font-semibold text-fg-1">Contatos</h3>
          <Link
            href={`/contatos?organizacao_id=${organizacao.id}`}
            className="text-[11px] text-fg-3 underline hover:text-fg-2"
          >
            Ver todos
          </Link>
        </div>
        {contatos.length === 0 ? (
          <p className="px-4 py-4 text-xs text-fg-3">Nenhum contato vinculado.</p>
        ) : (
          <ul>
            {contatos.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center justify-between border-b px-4 py-2.5 last:border-0"
                style={{ borderColor: "#E9DDF5", background: i % 2 === 0 ? "#FFF" : "#faf5ff" }}
              >
                <div>
                  <Link
                    href={`/contatos/${c.id}`}
                    className="text-xs font-medium text-fg-1 hover:underline"
                  >
                    {c.nome}
                  </Link>
                  {c.cargo && <span className="ml-2 text-[10px] text-fg-3">{c.cargo}</span>}
                </div>
                <span className="text-[10px] text-fg-3">{c.email ?? c.telefone ?? ""}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trilha */}
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
