"use client";

import { useState, useTransition } from "react";
import { atualizarEquipamento, alterarStatusEquipamento } from "@/app/actions/equipamento";
import type { Tables } from "@/lib/supabase/types";

type EqRow = Tables<"equipamento">;

const STATUS_LABEL: Record<string, string> = {
  ativo: "Ativo", inativo: "Inativo", em_manutencao: "Em manutenção",
};

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] text-fg-3">{label}</p>
      <p className="mt-0.5 text-xs text-fg-1">{value || "—"}</p>
    </div>
  );
}

export default function EquipamentoDetalhe({
  equipamento,
  trilha,
}: {
  equipamento: EqRow;
  trilha: Tables<"trilha_auditoria">[];
}) {
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const nome = [equipamento.tipo, equipamento.marca].filter(Boolean).join(" ");

  function handleSalvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await atualizarEquipamento(equipamento.id, fd, equipamento as unknown as Record<string, unknown>);
      if (res.erro) { setErro(res.erro); return; }
      setEditando(false);
    });
  }

  function handleAlterarStatus(novoStatus: string) {
    startTransition(async () => {
      await alterarStatusEquipamento(equipamento.id, novoStatus, equipamento as unknown as Record<string, unknown>);
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
            <h2 className="text-sm font-semibold text-fg-1">{nome || equipamento.tag}</h2>
            <p className="mt-0.5 font-mono text-xs text-fg-3">{equipamento.tag}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={
                equipamento.status === "ativo"
                  ? { background: "#DCFCE7", color: "#15803D" }
                  : equipamento.status === "em_manutencao"
                  ? { background: "#FEF3C7", color: "#92400E" }
                  : { background: "#F3F4F6", color: "#6B7280" }
              }
            >
              {STATUS_LABEL[equipamento.status] ?? equipamento.status}
            </span>
            <button
              onClick={() => setEditando(!editando)}
              className="rounded-md border px-3 py-1 text-xs text-fg-2 hover:text-fg-1"
              style={{ borderColor: "#E9DDF5" }}
            >
              {editando ? "Cancelar" : "Editar"}
            </button>
            {equipamento.status !== "ativo" && (
              <button
                onClick={() => handleAlterarStatus("ativo")}
                disabled={isPending}
                className="rounded-md border px-3 py-1 text-xs text-fg-3 hover:text-fg-1 disabled:opacity-50"
                style={{ borderColor: "#E9DDF5" }}
              >
                Ativar
              </button>
            )}
            {equipamento.status === "ativo" && (
              <>
                <button
                  onClick={() => handleAlterarStatus("em_manutencao")}
                  disabled={isPending}
                  className="rounded-md border px-3 py-1 text-xs text-fg-3 hover:text-fg-1 disabled:opacity-50"
                  style={{ borderColor: "#E9DDF5" }}
                >
                  Manutenção
                </button>
                <button
                  onClick={() => handleAlterarStatus("inativo")}
                  disabled={isPending}
                  className="rounded-md border px-3 py-1 text-xs text-fg-3 hover:text-fg-1 disabled:opacity-50"
                  style={{ borderColor: "#E9DDF5" }}
                >
                  Inativar
                </button>
              </>
            )}
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSalvar} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Tipo *</label>
                <input
                  name="tipo"
                  required
                  defaultValue={equipamento.tipo}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Marca</label>
                <input
                  name="marca"
                  defaultValue={equipamento.marca ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Tag *</label>
                <input
                  name="tag"
                  required
                  defaultValue={equipamento.tag}
                  className="w-full rounded-md border px-3 py-2 font-mono text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-fg-3">Nº Série</label>
                <input
                  name="numero_serie"
                  defaultValue={equipamento.numero_serie ?? ""}
                  className="w-full rounded-md border px-3 py-2 text-xs outline-none"
                  style={{ borderColor: "#E9DDF5" }}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-[11px] text-fg-3">Descrição</label>
                <textarea
                  name="descricao"
                  rows={3}
                  defaultValue={equipamento.descricao ?? ""}
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
            <Field label="Tipo" value={equipamento.tipo} />
            <Field label="Marca" value={equipamento.marca} />
            <Field label="Nº Série" value={equipamento.numero_serie} />
            <Field label="Descrição" value={equipamento.descricao} />
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
