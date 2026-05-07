import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RequisicaoDetalhe } from "@/components/requisicao-detalhe";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

type RequisicaoComJoins = Tables<"requisicao"> & {
  area: { id: string; sigla: string; nome: string } | null;
  fluxo: { id: string; nome: string } | null;
  etapa_atual: { id: string; nome: string; ordem: number } | null;
  responsavel: { id: string; nome: string } | null;
};

export default async function KanbanDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [reqRes, etapasRes, usuariosRes, trilhaRes] = await Promise.all([
    supabase
      .from("requisicao")
      .select(
        "*, area:area_id(id, sigla, nome), fluxo:fluxo_id(id, nome), etapa_atual:etapa_id(id, nome, ordem), responsavel:responsavel_id(id, nome)"
      )
      .eq("id", params.id)
      .single(),
    supabase
      .from("etapa")
      .select("id, nome, ordem")
      .order("ordem"),
    supabase
      .from("usuario")
      .select("id, nome")
      .eq("status", "ativo")
      .order("nome"),
    supabase
      .from("trilha_auditoria")
      .select("id, operacao, criado_em, dados_antes, dados_depois")
      .eq("tabela", "requisicao")
      .eq("registro_id", params.id)
      .order("criado_em", { ascending: false }),
  ]) as [
    { data: RequisicaoComJoins | null; error: unknown },
    { data: { id: string; nome: string; ordem: number }[] | null; error: unknown },
    { data: { id: string; nome: string }[] | null; error: unknown },
    { data: Tables<"trilha_auditoria">[] | null; error: unknown },
  ];

  if (!reqRes.data) notFound();

  const requisicao = reqRes.data;
  const etapas    = etapasRes.data ?? [];
  const usuarios  = usuariosRes.data ?? [];
  const trilha    = trilhaRes.data ?? [];

  return (
    <div>
      <div
        className="flex items-center gap-1.5 border-b px-6 py-2 text-xs text-fg-3"
        style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
      >
        <Link href="/kanban" className="hover:text-fg-2">Kanban</Link>
        <span>/</span>
        <span className="text-fg-2">{requisicao.numero}</span>
        <span className="max-w-xs truncate">— {requisicao.titulo}</span>
      </div>

      <RequisicaoDetalhe
        requisicao={requisicao}
        etapas={etapas}
        usuarios={usuarios}
        trilha={trilha}
      />
    </div>
  );
}
