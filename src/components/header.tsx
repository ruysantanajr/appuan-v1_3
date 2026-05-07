"use client";

import { usePathname } from "next/navigation";

const titulos: Record<string, string> = {
  "/entradas":      "Caixa de Entrada",
  "/demandas":      "Demandas",
  "/kanban":        "Kanban",
  "/organizacoes":  "Organizações",
  "/contatos":      "Contatos",
  "/equipamentos":  "Equipamentos",
  "/usuarios":      "Usuários",
};

function getTitulo(pathname: string): string {
  for (const [prefix, titulo] of Object.entries(titulos)) {
    if (pathname.startsWith(prefix)) return titulo;
  }
  return "appuan";
}

export default function Header() {
  const pathname = usePathname();
  const titulo = getTitulo(pathname);

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center border-b px-6"
      style={{ borderColor: "#E9DDF5", background: "#FFFFFF" }}
    >
      <h1 className="text-sm font-semibold text-fg-1">{titulo}</h1>
    </header>
  );
}
