import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import OrganizacaoDetalhe from "@/components/organizacao-detalhe";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

type ContatoRow = Tables<"contato">;

export default async function OrganizacaoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [orgRes, contatosRes, trilhaRes] = await Promise.all([
    supabase.from("organizacao").select("*").eq("id", params.id).single(),
    supabase
      .from("contato")
      .select("*")
      .eq("organizacao_id", params.id)
      .order("nome") as Promise<{ data: ContatoRow[] | null }>,
    supabase
      .from("trilha_auditoria")
      .select("id, operacao, criado_em, dados_antes, dados_depois")
      .eq("tabela", "organizacao")
      .eq("registro_id", params.id)
      .order("criado_em", { ascending: false }),
  ]) as [
    { data: Tables<"organizacao"> | null; error: unknown },
    { data: ContatoRow[] | null },
    { data: Tables<"trilha_auditoria">[] | null; error: unknown },
  ];

  if (!orgRes.data) notFound();

  return (
    <div>
      <div
        className="flex items-center gap-1.5 border-b px-6 py-2 text-xs text-fg-3"
        style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
      >
        <Link href="/organizacoes" className="hover:text-fg-2">Organizações</Link>
        <span>/</span>
        <span className="text-fg-2">{orgRes.data.nome}</span>
      </div>

      <OrganizacaoDetalhe
        organizacao={orgRes.data}
        contatos={contatosRes.data ?? []}
        trilha={trilhaRes.data ?? []}
      />
    </div>
  );
}
