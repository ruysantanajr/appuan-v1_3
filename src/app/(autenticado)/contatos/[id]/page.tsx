import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ContatoDetalhe from "@/components/contato-detalhe";
import Link from "next/link";
import type { Tables } from "@/lib/supabase/types";

type ContatoComOrg = Tables<"contato"> & {
  organizacao: { id: string; nome: string } | null;
};

export default async function ContatoDetalhePage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const [contatoRes, orgsRes, trilhaRes] = await Promise.all([
    supabase
      .from("contato")
      .select("*, organizacao:organizacao_id(id, nome)")
      .eq("id", params.id)
      .single(),
    supabase
      .from("organizacao")
      .select("id, nome")
      .eq("status", "ativa")
      .order("nome"),
    supabase
      .from("trilha_auditoria")
      .select("id, operacao, criado_em, dados_antes, dados_depois")
      .eq("tabela", "contato")
      .eq("registro_id", params.id)
      .order("criado_em", { ascending: false }),
  ]) as [
    { data: ContatoComOrg | null; error: unknown },
    { data: { id: string; nome: string }[] | null },
    { data: Tables<"trilha_auditoria">[] | null; error: unknown },
  ];

  if (!contatoRes.data) notFound();

  return (
    <div>
      <div
        className="flex items-center gap-1.5 border-b px-6 py-2 text-xs text-fg-3"
        style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
      >
        <Link href="/contatos" className="hover:text-fg-2">Contatos</Link>
        <span>/</span>
        <span className="text-fg-2">{contatoRes.data.nome}</span>
      </div>

      <ContatoDetalhe
        contato={contatoRes.data}
        organizacoes={orgsRes.data ?? []}
        trilha={trilhaRes.data ?? []}
      />
    </div>
  );
}
