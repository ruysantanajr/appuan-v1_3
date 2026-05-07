"use server";

import { createClient } from "@/lib/supabase/server";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { revalidatePath } from "next/cache";
import type { Json } from "@/lib/supabase/types";

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

export async function criarContato(formData: FormData) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const payload: Record<string, unknown> = {
    nome: formData.get("nome") as string,
    organizacao_id: (formData.get("organizacao_id") as string) || null,
    cargo: (formData.get("cargo") as string) || null,
    email: (formData.get("email") as string) || null,
    telefone: (formData.get("telefone") as string) || null,
    observacoes: (formData.get("observacoes") as string) || null,
    status: "ativo",
    criado_por,
    atualizado_por: criado_por,
  };

  const { data, error } = await insertRow(supabase, "contato", payload);
  if (error) return { erro: error.message };
  if (!data) return { erro: "Erro ao criar contato." };

  await insertAuditoria(supabase, {
    tabela: "contato",
    registro_id: data["id"] as string,
    operacao: "insert",
    dados_antes: null,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/contatos");
  return { ok: true, id: data["id"] as string };
}

export async function atualizarContato(
  id: string,
  formData: FormData,
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const payload: Record<string, unknown> = {
    nome: formData.get("nome") as string,
    organizacao_id: (formData.get("organizacao_id") as string) || null,
    cargo: (formData.get("cargo") as string) || null,
    email: (formData.get("email") as string) || null,
    telefone: (formData.get("telefone") as string) || null,
    observacoes: (formData.get("observacoes") as string) || null,
    atualizado_por: criado_por,
  };

  const { data, error } = await updateRow(supabase, "contato", payload, id);
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela: "contato",
    registro_id: id,
    operacao: "update",
    dados_antes: dadosAntes,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/contatos");
  revalidatePath(`/contatos/${id}`);
  return { ok: true };
}

export async function alterarStatusContato(
  id: string,
  novoStatus: string,
  dadosAntes: Record<string, unknown>
) {
  const supabase = createClient();
  const usuario = await getUsuarioAtual();
  const criado_por = usuario?.id ?? SENTINEL;

  const { data, error } = await updateRow(
    supabase,
    "contato",
    { status: novoStatus, atualizado_por: criado_por },
    id
  );
  if (error) return { erro: error.message };

  await insertAuditoria(supabase, {
    tabela: "contato",
    registro_id: id,
    operacao: "update",
    dados_antes: dadosAntes,
    dados_depois: data,
    criado_por,
  });

  revalidatePath("/contatos");
  revalidatePath(`/contatos/${id}`);
  return { ok: true };
}
