/**
 * Retorna o label de exibição de uma área.
 * Área pessoal sempre aparece como "Pessoal", independente da sigla.
 */
export function labelArea(
  area: { tipo?: string; sigla?: string; nome?: string } | null | undefined
): string {
  if (!area) return "—";
  if (area.tipo === "pessoal") return "Pessoal";
  return area.sigla?.trim() ?? area.nome ?? "—";
}
