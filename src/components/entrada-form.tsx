"use client";

import { useRef, useState, useTransition } from "react";
import { criarDemanda } from "@/app/actions/demanda";
import type { Tables } from "@/lib/supabase/types";

type Area = Tables<"area">;

const ORIGENS = [
  { value: "whatsapp",   label: "WhatsApp" },
  { value: "email",      label: "E-mail" },
  { value: "telefone",   label: "Telefone" },
  { value: "presencial", label: "Presencial" },
  { value: "interna",    label: "Interna" },
  { value: "outra",      label: "Outra" },
];

export default function EntradaForm({ areas }: { areas: Area[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    const fd = new FormData(e.currentTarget);
    if (!fd.get("descricao")) { setErro("Descrição obrigatória."); return; }
    if (!fd.get("area_id"))   { setErro("Selecione uma área."); return; }
    if (!fd.get("origem"))    { setErro("Selecione a origem."); return; }

    startTransition(async () => {
      const res = await criarDemanda(fd);
      if (res.erro) {
        setErro(res.erro);
      } else {
        setSucesso(true);
        formRef.current?.reset();
        setTimeout(() => setSucesso(false), 3000);
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {/* Descrição */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="descricao" className="text-xs font-medium text-fg-2">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={4}
          placeholder="Descreva a demanda..."
          className="w-full resize-none rounded-md border px-3 py-2 text-sm text-fg-1 placeholder:text-fg-disabled focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
          style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
          disabled={isPending}
        />
      </div>

      <div className="flex gap-3">
        {/* Área */}
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="area_id" className="text-xs font-medium text-fg-2">
            Área
          </label>
          <select
            id="area_id"
            name="area_id"
            defaultValue=""
            className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
            disabled={isPending}
          >
            <option value="" disabled>Selecione...</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>
                {a.sigla?.trim()} — {a.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Origem */}
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="origem" className="text-xs font-medium text-fg-2">
            Origem
          </label>
          <select
            id="origem"
            name="origem"
            defaultValue=""
            className="w-full rounded-md border px-3 py-2 text-sm text-fg-1 focus:outline-none focus:ring-2 focus:ring-purple-hover/40"
            style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
            disabled={isPending}
          >
            <option value="" disabled>Selecione...</option>
            {ORIGENS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {erro && (
        <p className="rounded-md bg-danger-bg px-3 py-2 text-xs text-danger">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="rounded-md bg-success-bg px-3 py-2 text-xs text-success">
          Demanda registrada com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-end rounded-md px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
        style={{ background: isPending ? "#7A6B8E" : "#3a1165" }}
        onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#7C3AED"; }}
        onMouseLeave={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = "#3a1165"; }}
      >
        {isPending ? "Registrando..." : "Registrar demanda"}
      </button>
    </form>
  );
}
