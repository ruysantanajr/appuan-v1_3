import { createClient } from "@/lib/supabase/server";
import ContatosList from "@/components/contatos-list";
import type { Tables } from "@/lib/supabase/types";

type ContatoComOrg = Tables<"contato"> & {
  organizacao: { id: string; nome: string } | null;
};

export default async function ContatosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [contatosRes, orgsRes] = await Promise.all([
    supabase
      .from("contato")
      .select("*, organizacao:organizacao_id(id, nome)")
      .order("nome"),
    supabase
      .from("organizacao")
      .select("id, nome")
      .eq("status", "ativa")
      .order("nome"),
  ]) as [
    { data: ContatoComOrg[] | null },
    { data: { id: string; nome: string }[] | null },
  ];

  return (
    <ContatosList
      contatos={(contatosRes.data ?? []) as ContatoComOrg[]}
      organizacoes={orgsRes.data ?? []}
    />
  );
}
