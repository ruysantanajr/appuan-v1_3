import { createClient } from "@/lib/supabase/server";
import EntradaForm from "@/components/entrada-form";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";
import { labelArea } from "@/lib/area-utils";

type DemandaRecente = Tables<"demanda"> & {
  area: { nome: string; sigla: string; tipo: string } | null;
};

type Area = Tables<"area">;

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

export default async function EntradaPage() {
  const supabase = createClient();

  const [areasRes, recentesRes] = await Promise.all([
    supabase.from("area").select("id, nome, sigla, tipo").eq("status", "ativa").order("nome"),
    supabase
      .from("demanda")
      .select("id, descricao, origem, status, criado_em, area:area_id(nome, sigla, tipo)")
      .order("criado_em", { ascending: false })
      .limit(10),
  ]);

  const areas   = (areasRes.data ?? []) as Area[];
  const recentes = (recentesRes.data ?? []) as DemandaRecente[];

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Card do formulário */}
      <div
        className="rounded-lg border p-6"
        style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
      >
        <h2 className="mb-1 text-sm font-semibold text-fg-1">Nova demanda</h2>
        <p className="mb-5 text-xs text-fg-3">
          Registre rapidamente. Sem fricção.
        </p>
        <EntradaForm areas={areas} />
      </div>

      {/* Recentes */}
      {recentes.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-3">
              Recentes
            </h3>
            <Link
              href="/demandas"
              className="text-xs text-fg-3 underline hover:text-fg-2"
            >
              Ver todas
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recentes.map(d => {
              const st = STATUS_STYLE[d.status] ?? { bg: "#F3F4F6", color: "#6B7280" };
              return (
                <li key={d.id}>
                  <Link
                    href={`/demandas/${d.id}`}
                    className="flex items-start gap-3 rounded-md border px-4 py-3 transition-colors hover:bg-bg-hover"
                    style={{ background: "#FFFFFF", borderColor: "#E9DDF5" }}
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {d.status}
                    </span>
                    <span className="flex-1 text-xs text-fg-1 line-clamp-2">
                      {d.descricao}
                    </span>
                    <span className="flex-shrink-0 text-[10px] text-fg-3">
                      {labelArea(d.area)} · {LABEL_ORIGEM[d.origem] ?? d.origem}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
