import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EquipamentoDetalhe from "@/components/equipamento-detalhe";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

export default async function EquipamentoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [eqRes, trilhaRes] = await Promise.all([
    supabase.from("equipamento").select("*").eq("id", params.id).single(),
    supabase
      .from("trilha_auditoria")
      .select("id, operacao, criado_em, dados_antes, dados_depois")
      .eq("tabela", "equipamento")
      .eq("registro_id", params.id)
      .order("criado_em", { ascending: false }),
  ]) as [
    { data: Tables<"equipamento"> | null; error: unknown },
    { data: Tables<"trilha_auditoria">[] | null; error: unknown },
  ];

  if (!eqRes.data) notFound();

  const nome = [eqRes.data.tipo, eqRes.data.marca].filter(Boolean).join(" ");

  return (
    <div>
      <div
        className="flex items-center gap-1.5 border-b px-6 py-2 text-xs text-fg-3"
        style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
      >
        <Link href="/equipamentos" className="hover:text-fg-2">Equipamentos</Link>
        <span>/</span>
        <span className="text-fg-2">{eqRes.data.tag}</span>
        {nome && <span>— {nome}</span>}
      </div>

      <EquipamentoDetalhe
        equipamento={eqRes.data}
        trilha={trilhaRes.data ?? []}
      />
    </div>
  );
}
