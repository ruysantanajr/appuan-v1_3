"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Inbox,
  List,
  Kanban,
  Building2,
  Users,
  Wrench,
  UserCog,
  LogOut,
} from "lucide-react";

const itens = [
  { href: "/entradas",    label: "Caixa de Entrada", icon: Inbox },
  { href: "/demandas",    label: "Demandas",          icon: List },
  { href: "/kanban",      label: "Kanban",            icon: Kanban },
  { href: "/organizacoes",label: "Organizações",      icon: Building2 },
  { href: "/contatos",    label: "Contatos",          icon: Users },
  { href: "/equipamentos",label: "Equipamentos",      icon: Wrench },
  { href: "/usuarios",    label: "Usuários",          icon: UserCog },
];

export default function Sidebar({ usuario }: { usuario: User }) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const nomeExibido =
    usuario.user_metadata?.full_name ||
    usuario.user_metadata?.name ||
    usuario.email ||
    "Usuário";

  const inicial = nomeExibido[0].toUpperCase();

  return (
    <aside
      className="flex h-full w-60 flex-shrink-0 flex-col"
      style={{ background: "#170024" }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-5">
        <LogoOnDark />
      </div>

      {/* Divisor */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />

      {/* Navegação */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {itens.map(({ href, label, icon: Icon }) => {
          const ativo = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
              style={{
                color:      ativo ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                background: ativo ? "#3a1165" : "transparent",
              }}
              onMouseEnter={e => {
                if (!ativo) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(58,17,101,0.6)";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={e => {
                if (!ativo) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.72)";
                }
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="px-4 py-4">
        <div className="mb-3 flex min-w-0 items-center gap-3">
          {usuario.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={usuario.user_metadata.avatar_url}
              alt=""
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
              style={{ border: "1.5px solid rgba(165,104,228,0.4)" }}
            />
          ) : (
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "#3a1165" }}
            >
              {inicial}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              {nomeExibido}
            </p>
            <p className="truncate text-[11px]" style={{ color: "rgba(255,255,255,0.48)" }}>
              {usuario.email}
            </p>
          </div>
        </div>

        <button
          onClick={sair}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.48)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(58,17,101,0.6)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.48)";
          }}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}

/* Logo inline — "app" branco + "uan" #A568E4 sobre fundo escuro */
function LogoOnDark() {
  return (
    <svg
      viewBox="0 0 168 44"
      height="28"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="appuan"
      role="img"
    >
      <text
        y="36"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="40"
        letterSpacing="-0.03em"
      >
        <tspan fill="#FFFFFF">app</tspan><tspan fill="#A568E4">uan</tspan>
      </text>
    </svg>
  );
}
