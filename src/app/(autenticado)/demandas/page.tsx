import { createClient } from "@/lib/supabase/server";
import DemandasTable from "@/components/demandas-table";
import Link from "next/link";

export default async function DemandasPage() {
  const supabase = createClient();

  const [{ data: demandas }, { data: areas }] = await Promise.all([
    supabase
      .from("demanda")
      .select("*, area:area_id(nome, sigla, tipo), criador:criado_por(nome)")
      .order("criado_em", { ascending: false }),
    supabase.from("area").select("id, nome, sigla, tipo").eq("status", "ativa").order("nome"),
  ]);

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div />
        <Link
          href="/entradas"
          className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: "#3a1165" }}
          onMouseEnter={undefined}
        >
          + Nova demanda
        </Link>
      </div>
      <DemandasTable
        demandas={(demandas ?? []) as Parameters<typeof DemandasTable>[0]["demandas"]}
        areas={areas ?? []}
      />
    </div>
  );
}
