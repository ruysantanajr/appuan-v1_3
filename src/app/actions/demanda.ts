"use server";

import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { revalidatePath } from "next/cache";
import type { TablesInsert, Tables, Json } from "@/lib/supabase/types";

const SENTINEL = "00000000-0000-0000-0000-000000000000";

type SupabaseAny = ReturnType<typeof createClient>;

async function insertRow(
  supabase: SupabaseAny,
  table: string,
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table).insert(payload).select().single();
}

async function updateRow(
  supabase: SupabaseAny,
  table: string,
  payload: Record<string, unknown>,
  id: string
): Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table).update(payload).eq("id", id).select().single();
}

async function insertAuditoria(
  supabase: SupabaseAny,
  payload: TablesInsert<"trilha_auditoria"> | TablesInsert<"trilha_auditoria">[]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("trilha_auditoria").insert(payload);
}

export async function criarDemanda(formData: FormData) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const payload: TablesInsert<"demanda"> = {
    descricao: formData.get("descricao") as string,
    area_id:   formData.get("area_id")   as string,
    origem:    formData.get("origem")    as string,
    status:    "nova",
    criado_por,
    atualizado_por: criado_por,
  };

  const { data, error } = await insertRow(supabase, "demanda", payload as Record<string, unknown>);
  if (error) return { erro: error.message };
  if (!data) return { erro: "Erro ao criar demanda." };

  await insertAuditoria(supabase, {
    tabela:       "demanda",
    registro_id:  data["id"] as string,
    operacao:     "insert",
    dados_antes:  null,
    dados_depois: data as Json,
    criado_por,
  });

  revalidatePath("/entradas");
  revalidatePath("/demandas");
  return { ok: true, id: data["id"] as string };
}

export async function atualizarStatusDemanda(
  id: string,
  novoStatus: string,
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const { data, error } = await updateRow(
    supabase, "demanda",
    { status: novoStatus, atualizado_por: criado_por },
    id
  );
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela:       "demanda",
    registro_id:  id,
    operacao:     "update",
    dados_antes:  dadosAntes as Json,
    dados_depois: data as Json,
    criado_por,
  });

  revalidatePath("/demandas");
  revalidatePath(`/demandas/${id}`);
  return { ok: true };
}

export async function converterDemandaEmRequisicao(
  demandaId: string,
  dadosRequisicao: {
    titulo: string;
    area_id: string;
    fluxo_id: string;
    etapa_id: string;
    descricao?: string;
  },
  dadosAntesDemanda: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  // Busca sigla da área
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: area } = await (supabase as any)
    .from("area")
    .select("sigla")
    .eq("id", dadosRequisicao.area_id)
    .single() as { data: Tables<"area"> | null };

  const sigla = area?.sigla?.trim() ?? "REQ";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (supabase as any)
    .from("requisicao")
    .select("*", { count: "exact", head: true })
    .eq("area_id", dadosRequisicao.area_id) as { count: number | null };

  const seq = String((count ?? 0) + 1).padStart(6, "0");
  const numero = `REQ-${sigla}-${seq}`;

  const payload: TablesInsert<"requisicao"> = {
    numero,
    titulo:      dadosRequisicao.titulo,
    descricao:   dadosRequisicao.descricao ?? null,
    area_id:     dadosRequisicao.area_id,
    fluxo_id:    dadosRequisicao.fluxo_id,
    etapa_id:    dadosRequisicao.etapa_id,
    demanda_id:  demandaId,
    status:      "em fila",
    criado_por,
    atualizado_por: criado_por,
  };

  const { data: req, error: errReq } = await insertRow(
    supabase, "requisicao", payload as Record<string, unknown>
  );
  if (errReq) return { erro: errReq.message };
  if (!req) return { erro: "Erro ao criar requisição." };

  // Marca demanda como convertida
  const { data: demAtual } = await updateRow(
    supabase, "demanda",
    { status: "convertida", atualizado_por: criado_por },
    demandaId
  );

  await insertAuditoria(supabase, [
    {
      tabela: "requisicao", registro_id: req["id"] as string,
      operacao: "insert", dados_antes: null,
      dados_depois: req as Json, criado_por,
    },
    {
      tabela: "demanda", registro_id: demandaId,
      operacao: "update", dados_antes: dadosAntesDemanda as Json,
      dados_depois: demAtual as Json, criado_por,
    },
  ]);

  revalidatePath("/demandas");
  revalidatePath(`/demandas/${demandaId}`);
  revalidatePath("/kanban");
  return { ok: true, requisicaoId: req["id"] as string, numero };
}
