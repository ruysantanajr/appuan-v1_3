import { createClient } from "@/lib/supabase/server";
import EquipamentosList from "@/components/equipamentos-list";
import type { Tables } from "@/lib/supabase/types";

export default async function EquipamentosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const { data } = await supabase
    .from("equipamento")
    .select("*")
    .order("tipo") as { data: Tables<"equipamento">[] | null };

  return <EquipamentosList equipamentos={data ?? []} />;
}
