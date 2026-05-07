import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "@/components/kanban-board";

export default async function KanbanPage() {
  const supabase = createClient();

  const { data: requisicoes } = await supabase
    .from("requisicao")
    .select("*, area:area_id(sigla, nome, tipo), responsavel:responsavel_id(nome)")
    .not("status", "in", '("concluida","cancelada")')
    .order("criado_em", { ascending: false });

  // Também busca concluídas/canceladas recentes (últimas 30 dias)
  const trinta = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: fechadas } = await supabase
    .from("requisicao")
    .select("*, area:area_id(sigla, nome, tipo), responsavel:responsavel_id(nome)")
    .in("status", ["concluida", "cancelada"])
    .gte("atualizado_em", trinta)
    .order("atualizado_em", { ascending: false });

  const todas = [...(requisicoes ?? []), ...(fechadas ?? [])];

  return (
    <div className="h-full overflow-hidden">
      <KanbanBoard
        requisicoes={todas as Parameters<typeof KanbanBoard>[0]["requisicoes"]}
      />
    </div>
  );
}
