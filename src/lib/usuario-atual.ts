import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export async function getUsuarioAtual(): Promise<Tables<"usuario"> | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data } = await supabase
    .from("usuario")
    .select("*")
    .eq("email", user.email)
    .single();

  return data;
}
