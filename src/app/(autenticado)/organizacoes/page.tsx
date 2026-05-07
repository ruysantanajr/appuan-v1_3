import { createClient } from "@/lib/supabase/server";
import OrganizacoesList from "@/components/organizacoes-list";
import type { Tables } from "@/lib/supabase/types";

type OrgRow = Tables<"organizacao">;

export default async function OrganizacoesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const { data } = await supabase
    .from("organizacao")
    .select("*")
    .order("nome") as { data: OrgRow[] | null };

  const organizacoes = (data ?? []) as OrgRow[];

  return <OrganizacoesList organizacoes={organizacoes} />;
}
