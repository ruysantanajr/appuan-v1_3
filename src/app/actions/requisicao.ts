"use server";

import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { revalidatePath } from "next/cache";
import type { Json } from "@/lib/supabase/types";

const SENTINEL = "00000000-0000-0000-0000-000000000000";

type SupabaseAny = ReturnType<typeof createClient>;

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
  payload: {
    tabela: string;
    registro_id: string;
    operacao: string;
    dados_antes: unknown;
    dados_depois: unknown;
    criado_por: string;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("trilha_auditoria").insert({
    tabela: payload.tabela,
    registro_id: payload.registro_id,
    operacao: payload.operacao,
    dados_antes: payload.dados_antes as Json,
    dados_depois: payload.dados_depois as Json,
    criado_por: payload.criado_por,
  });
}

export async function atualizarStatusRequisicao(
  id: string,
  novoStatus: string,
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const { data, error } = await updateRow(
    supabase,
    "requisicao",
    { status: novoStatus, atualizado_por: criado_por },
    id
  );
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela: "requisicao",
    registro_id: id,
    operacao: "update",
    dados_antes: dadosAntes,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/kanban");
  revalidatePath(`/kanban/${id}`);
  return { ok: true };
}

export async function atualizarEtapaRequisicao(
  id: string,
  etapaId: string,
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const { data, error } = await updateRow(
    supabase,
    "requisicao",
    { etapa_id: etapaId, atualizado_por: criado_por },
    id
  );
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela: "requisicao",
    registro_id: id,
    operacao: "update",
    dados_antes: dadosAntes,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/kanban");
  revalidatePath(`/kanban/${id}`);
  return { ok: true };
}

export async function atualizarCamposRequisicao(
  id: string,
  campos: {
    titulo?: string;
    descricao?: string;
    responsavel_id?: string;
    prazo?: string;
    organizacao?: string;
    contato?: string;
    equipamento?: string;
  },
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const payload: Record<string, unknown> = { atualizado_por: criado_por };
  if (campos.titulo !== undefined) payload.titulo = campos.titulo;
  if (campos.descricao !== undefined) payload.descricao = campos.descricao;
  if (campos.responsavel_id !== undefined) payload.responsavel_id = campos.responsavel_id || null;
  if (campos.prazo !== undefined) payload.prazo = campos.prazo || null;
  if (campos.organizacao !== undefined) payload.organizacao = campos.organizacao || null;
  if (campos.contato !== undefined) payload.contato = campos.contato || null;
  if (campos.equipamento !== undefined) payload.equipamento = campos.equipamento || null;

  const { data, error } = await updateRow(supabase, "requisicao", payload, id);
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela: "requisicao",
    registro_id: id,
    operacao: "update",
    dados_antes: dadosAntes,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/kanban");
  revalidatePath(`/kanban/${id}`);
  return { ok: true };
}
