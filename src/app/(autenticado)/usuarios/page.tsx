import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

type UsuarioRow = Pick<Tables<"usuario">, "id" | "nome" | "email" | "tipo" | "status" | "criado_em">;

export default async function UsuariosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const { data } = await supabase
    .from("usuario")
    .select("id, nome, email, tipo, status, criado_em")
    .order("nome") as { data: UsuarioRow[] | null };

  const usuarios = (data ?? []) as UsuarioRow[];

  return (
    <div className="px-6 py-8">
      <div
        className="overflow-hidden rounded-lg border"
        style={{ borderColor: "#E9DDF5" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F0FA" }}>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Nome</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">E-mail</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Tipo</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-fg-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr
                key={u.id}
                className="border-t"
                style={{ background: i % 2 === 0 ? "#FFFFFF" : "#faf5ff" }}
              >
                <td className="px-4 py-2.5 text-xs font-medium text-fg-1">{u.nome}</td>
                <td className="px-4 py-2.5 text-xs text-fg-2">{u.email}</td>
                <td className="px-4 py-2.5 text-xs text-fg-3">{u.tipo}</td>
                <td className="px-4 py-2.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={
                      u.status === "ativo"
                        ? { background: "#DCFCE7", color: "#15803D" }
                        : { background: "#F3F4F6", color: "#6B7280" }
                    }
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
