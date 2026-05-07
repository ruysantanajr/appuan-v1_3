import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DemandaDetalhe from "@/components/demanda-detalhe";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

type DemandaComArea = Tables<"demanda"> & {
  area: { id: string; nome: string; sigla: string; tipo: string } | null;
};
type FluxoComEtapas = Tables<"fluxo"> & { etapas: Tables<"etapa">[] };

export default async function DemandaDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [demandaRes, fluxosRes, trilhaRes] = await Promise.all([
    supabase.from("demanda").select("*, area:area_id(id, nome, sigla, tipo)").eq("id", params.id).single(),
    supabase.from("fluxo").select("*, etapas:etapa(id, nome, ordem, status_gatilho)").eq("status", "ativo"),
    supabase.from("trilha_auditoria").select("*").eq("tabela", "demanda").eq("registro_id", params.id).order("criado_em", { ascending: false }),
  ]) as [
    { data: DemandaComArea | null; error: unknown },
    { data: FluxoComEtapas[] | null; error: unknown },
    { data: Tables<"trilha_auditoria">[] | null; error: unknown },
  ];

  if (!demandaRes.data) notFound();

  const demanda = demandaRes.data;
  const fluxos  = fluxosRes.data ?? [];
  const trilha  = trilhaRes.data ?? [];

  return (
    <div>
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 border-b px-6 py-2 text-xs text-fg-3"
        style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
      >
        <Link href="/demandas" className="hover:text-fg-2">Demandas</Link>
        <span>/</span>
        <span className="max-w-xs truncate text-fg-2">
          {demanda.descricao.slice(0, 60)}
          {demanda.descricao.length > 60 ? "…" : ""}
        </span>
      </div>

      <DemandaDetalhe
        demanda={demanda}
        fluxos={fluxos}
        trilha={trilha}
      />
    </div>
  );
}
