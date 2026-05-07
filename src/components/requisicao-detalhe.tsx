"use client";

import { useTransition, useState } from "react";
import {
  atualizarStatusRequisicao,
  atualizarEtapaRequisicao,
  atualizarCamposRequisicao,
} from "@/app/actions/requisicao";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG_APP = "#F5F0FA";
const BG_SURFACE = "#FFF";
const BORDER = "#E9DDF5";
const FG_1 = "#1F1230";
const FG_2 = "#4B3A66";
const FG_3 = "#7A6B8E";
const ACCENT = "#3a1165";
const PURPLE_HOVER = "#7C3AED";

// ─── Types ────────────────────────────────────────────────────────────────────
type Requisicao = {
  id: string;
  numero: string;
  titulo: string;
  descricao: string | null;
  status: string;
  etapa_id: string;
  fluxo_id: string;
  prazo: string | null;
  responsavel_id: string | null;
  organizacao: string | null;
  contato: string | null;
  equipamento: string | null;
  area: { sigla: string; nome: string } | null;
  fluxo: { id: string; nome: string } | null;
  etapa_atual: { id: string; nome: string; ordem: number } | null;
  responsavel: { id: string; nome: string } | null;
  criado_em: string;
  atualizado_em: string;
};

type Props = {
  requisicao: Requisicao;
  etapas: { id: string; nome: string; ordem: number }[];
  usuarios: { id: string; nome: string }[];
  trilha: {
    id: string;
    operacao: string;
    criado_em: string;
    dados_antes: unknown;
    dados_depois: unknown;
  }[];
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function statusColor(status: string): { bg: string; color: string } {
  switch (status) {
    case "a fazer":
      return { bg: "#F3F4F6", color: "#374151" };
    case "em fila":
      return { bg: "#DBEAFE", color: "#1D4ED8" };
    case "em andamento":
      return { bg: "#FEF3C7", color: "#92400E" };
    case "aguardando":
      return { bg: "#EDE9FE", color: "#6B21D4" };
    case "concluida":
      return { bg: "#D1FAE5", color: "#065F46" };
    case "cancelada":
      return { bg: "#FEE2E2", color: "#991B1B" };
    default:
      return { bg: "#F3F4F6", color: "#374151" };
  }
}

function StatusBadge({ status }: { status: string }) {
  const { bg, color } = statusColor(status);
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.2,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ─── Step progress ────────────────────────────────────────────────────────────
function ProgressoEtapas({
  etapas,
  etapaAtualId,
}: {
  etapas: { id: string; nome: string; ordem: number }[];
  etapaAtualId: string;
}) {
  const sorted = [...etapas].sort((a, b) => a.ordem - b.ordem);
  const atualIdx = sorted.findIndex((e) => e.id === etapaAtualId);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", rowGap: 8 }}>
      {sorted.map((etapa, idx) => {
        const isCurrent = etapa.id === etapaAtualId;
        const isPast = idx < atualIdx;
        return (
          <div key={etapa.id} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isCurrent ? ACCENT : isPast ? PURPLE_HOVER : BORDER,
                  color: isCurrent || isPast ? "#FFF" : FG_3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  border: isCurrent ? `2px solid ${PURPLE_HOVER}` : "none",
                  boxShadow: isCurrent ? `0 0 0 3px rgba(124,58,237,0.18)` : "none",
                  flexShrink: 0,
                }}
              >
                {isPast ? "✓" : idx + 1}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: isCurrent ? ACCENT : isPast ? PURPLE_HOVER : FG_3,
                  fontWeight: isCurrent ? 700 : 400,
                  maxWidth: 64,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {etapa.nome}
              </span>
            </div>
            {idx < sorted.length - 1 && (
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: idx < atualIdx ? PURPLE_HOVER : BORDER,
                  margin: "0 2px",
                  marginBottom: 14,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Audit trail row ──────────────────────────────────────────────────────────
function TrilhaRow({
  item,
}: {
  item: {
    id: string;
    operacao: string;
    criado_em: string;
    dados_antes: unknown;
    dados_depois: unknown;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const data = new Date(item.criado_em);
  const dataFmt = data.toLocaleDateString("pt-BR");
  const horaFmt = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      style={{
        borderBottom: `1px solid ${BORDER}`,
        paddingBottom: 10,
        marginBottom: 10,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              background: item.operacao === "insert" ? "#D1FAE5" : "#DBEAFE",
              color: item.operacao === "insert" ? "#065F46" : "#1D4ED8",
              padding: "1px 7px",
              borderRadius: 999,
            }}
          >
            {item.operacao}
          </span>
          <span style={{ fontSize: 12, color: FG_2 }}>
            {dataFmt} às {horaFmt}
          </span>
        </div>
        <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            fontSize: 11,
            color: PURPLE_HOVER,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          {expanded ? "▲ ocultar" : "▼ detalhes"}
        </button>
      </div>
      {expanded && (
        <div
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <div>
            <p style={{ fontSize: 10, color: FG_3, marginBottom: 4, fontWeight: 600 }}>ANTES</p>
            <pre
              style={{
                fontSize: 10,
                background: BG_APP,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: 8,
                overflowX: "auto",
                color: FG_2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {item.dados_antes ? JSON.stringify(item.dados_antes, null, 2) : "—"}
            </pre>
          </div>
          <div>
            <p style={{ fontSize: 10, color: FG_3, marginBottom: 4, fontWeight: 600 }}>DEPOIS</p>
            <pre
              style={{
                fontSize: 10,
                background: BG_APP,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: 8,
                overflowX: "auto",
                color: FG_2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {item.dados_depois ? JSON.stringify(item.dados_depois, null, 2) : "—"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function RequisicaoDetalhe({ requisicao, etapas, usuarios, trilha }: Props) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  // Inline edit state
  const [editResponsavel, setEditResponsavel] = useState(
    requisicao.responsavel_id ?? ""
  );
  const [editPrazo, setEditPrazo] = useState(
    requisicao.prazo ? requisicao.prazo.slice(0, 10) : ""
  );
  const [editOrg, setEditOrg] = useState(requisicao.organizacao ?? "");
  const [editContato, setEditContato] = useState(requisicao.contato ?? "");
  const [editEquipamento, setEditEquipamento] = useState(requisicao.equipamento ?? "");
  const [camposSalvos, setCamposSalvos] = useState(false);

  const sortedEtapas = [...etapas].sort((a, b) => a.ordem - b.ordem);
  const etapaAtualIdx = sortedEtapas.findIndex((e) => e.id === requisicao.etapa_id);
  const proximaEtapa =
    etapaAtualIdx >= 0 && etapaAtualIdx < sortedEtapas.length - 1
      ? sortedEtapas[etapaAtualIdx + 1]
      : null;

  const dadosAtuais: Record<string, unknown> = {
    status: requisicao.status,
    etapa_id: requisicao.etapa_id,
    responsavel_id: requisicao.responsavel_id,
    prazo: requisicao.prazo,
    organizacao: requisicao.organizacao,
    contato: requisicao.contato,
    equipamento: requisicao.equipamento,
  };

  function handleStatusAction(novoStatus: string) {
    setErro(null);
    startTransition(async () => {
      const res = await atualizarStatusRequisicao(requisicao.id, novoStatus, dadosAtuais);
      if (res && "erro" in res) setErro(res.erro ?? null);
    });
  }

  function handleAvancarEtapa() {
    if (!proximaEtapa) return;
    setErro(null);
    startTransition(async () => {
      const res = await atualizarEtapaRequisicao(
        requisicao.id,
        proximaEtapa.id,
        dadosAtuais
      );
      if (res && "erro" in res) setErro(res.erro ?? null);
    });
  }

  function handleSalvarCampos() {
    setErro(null);
    setCamposSalvos(false);
    startTransition(async () => {
      const res = await atualizarCamposRequisicao(
        requisicao.id,
        {
          responsavel_id: editResponsavel,
          prazo: editPrazo,
          organizacao: editOrg,
          contato: editContato,
          equipamento: editEquipamento,
        },
        dadosAtuais
      );
      if (res && "erro" in res) {
        setErro(res.erro ?? null);
      } else {
        setCamposSalvos(true);
      }
    });
  }

  const btnBase: React.CSSProperties = {
    padding: "7px 16px",
    borderRadius: 8,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: isPending ? "not-allowed" : "pointer",
    opacity: isPending ? 0.65 : 1,
    transition: "background 0.15s",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: ACCENT,
    color: "#FFF",
  };

  const btnSecondary: React.CSSProperties = {
    ...btnBase,
    background: BG_APP,
    color: FG_1,
    border: `1px solid ${BORDER}`,
  };

  const btnDanger: React.CSSProperties = {
    ...btnBase,
    background: "#FEE2E2",
    color: "#991B1B",
    border: "1px solid #FCA5A5",
  };

  const btnOutline: React.CSSProperties = {
    ...btnBase,
    background: "transparent",
    color: PURPLE_HOVER,
    border: `1px solid ${PURPLE_HOVER}`,
  };

  const inputStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 7,
    border: `1px solid ${BORDER}`,
    background: BG_APP,
    color: FG_1,
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: FG_3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
    display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    background: BG_SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: FG_2,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: `1px solid ${BORDER}`,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  };

  const gridTwo: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  };

  const isTerminal =
    requisicao.status === "concluida" || requisicao.status === "cancelada";

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: FG_1,
        background: BG_APP,
        minHeight: "100vh",
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              color: PURPLE_HOVER,
              fontWeight: 700,
              background: "#EDE9FE",
              padding: "2px 10px",
              borderRadius: 6,
            }}
          >
            {requisicao.numero}
          </span>
          <StatusBadge status={requisicao.status} />
          {requisicao.area && (
            <span
              style={{
                fontSize: 11,
                color: FG_3,
                background: BORDER,
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              {requisicao.area.sigla}
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: FG_1, margin: 0 }}>
          {requisicao.titulo}
        </h1>
      </div>

      {/* ── Error banner ── */}
      {erro && (
        <div
          style={{
            background: "#FEE2E2",
            border: "1px solid #FCA5A5",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#991B1B",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {erro}
        </div>
      )}

      {/* ── Detalhes ── */}
      <div style={sectionStyle}>
        <p style={sectionTitle}>Detalhes</p>

        {requisicao.descricao && (
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>Descrição</span>
            <p style={{ fontSize: 14, color: FG_2, margin: 0, lineHeight: 1.6 }}>
              {requisicao.descricao}
            </p>
          </div>
        )}

        <div style={gridTwo}>
          <div>
            <span style={labelStyle}>Área</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.area ? `${requisicao.area.sigla} — ${requisicao.area.nome}` : "—"}
            </p>
          </div>
          <div>
            <span style={labelStyle}>Fluxo</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.fluxo?.nome ?? "—"}
            </p>
          </div>
        </div>

        {/* Progresso de etapas */}
        <div style={{ marginTop: 20 }}>
          <span style={{ ...labelStyle, marginBottom: 12 }}>Progresso das Etapas</span>
          {etapas.length > 0 ? (
            <ProgressoEtapas etapas={etapas} etapaAtualId={requisicao.etapa_id} />
          ) : (
            <p style={{ fontSize: 13, color: FG_3, margin: 0 }}>Nenhuma etapa configurada.</p>
          )}
        </div>

        <div style={{ ...gridTwo, marginTop: 16 }}>
          <div>
            <span style={labelStyle}>Prazo</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.prazo
                ? new Date(requisicao.prazo).toLocaleDateString("pt-BR")
                : "—"}
            </p>
          </div>
          <div>
            <span style={labelStyle}>Responsável</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.responsavel?.nome ?? "—"}
            </p>
          </div>
        </div>

        <div style={{ ...gridTwo, marginTop: 14 }}>
          <div>
            <span style={labelStyle}>Organização</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.organizacao || "—"}
            </p>
          </div>
          <div>
            <span style={labelStyle}>Contato</span>
            <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
              {requisicao.contato || "—"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <span style={labelStyle}>Equipamento</span>
          <p style={{ fontSize: 13, color: FG_1, margin: 0 }}>
            {requisicao.equipamento || "—"}
          </p>
        </div>

        <div
          style={{
            ...gridTwo,
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div>
            <span style={labelStyle}>Criado em</span>
            <p style={{ fontSize: 12, color: FG_3, margin: 0 }}>
              {new Date(requisicao.criado_em).toLocaleString("pt-BR")}
            </p>
          </div>
          <div>
            <span style={labelStyle}>Atualizado em</span>
            <p style={{ fontSize: 12, color: FG_3, margin: 0 }}>
              {new Date(requisicao.atualizado_em).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Ações ── */}
      {!isTerminal && (
        <div style={sectionStyle}>
          <p style={sectionTitle}>Ações</p>

          {/* Transições de status */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {requisicao.status === "em fila" && (
              <button style={btnPrimary} disabled={isPending} onClick={() => handleStatusAction("em andamento")}>
                ▶ Iniciar
              </button>
            )}
            {requisicao.status === "em andamento" && (
              <>
                <button style={btnSecondary} disabled={isPending} onClick={() => handleStatusAction("aguardando")}>
                  ⏸ Pausar
                </button>
                <button
                  style={{ ...btnPrimary, background: "#065F46", color: "#FFF" }}
                  disabled={isPending}
                  onClick={() => handleStatusAction("concluida")}
                >
                  ✓ Concluir
                </button>
              </>
            )}
            {requisicao.status === "aguardando" && (
              <button style={btnPrimary} disabled={isPending} onClick={() => handleStatusAction("em andamento")}>
                ▶ Retomar
              </button>
            )}
            {requisicao.status === "a fazer" && (
              <button style={btnPrimary} disabled={isPending} onClick={() => handleStatusAction("em fila")}>
                → Enfileirar
              </button>
            )}

            {proximaEtapa && (
              <button style={btnOutline} disabled={isPending} onClick={handleAvancarEtapa}>
                Avançar etapa → {proximaEtapa.nome}
              </button>
            )}

            <button style={btnDanger} disabled={isPending} onClick={() => handleStatusAction("cancelada")}>
              ✕ Cancelar
            </button>
          </div>

          {/* Edição inline de campos */}
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label style={labelStyle}>Responsável</label>
              <select
                value={editResponsavel}
                onChange={(e) => setEditResponsavel(e.target.value)}
                style={{ ...inputStyle }}
              >
                <option value="">— nenhum —</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Prazo</label>
              <input
                type="date"
                value={editPrazo}
                onChange={(e) => setEditPrazo(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Organização</label>
              <input
                type="text"
                value={editOrg}
                onChange={(e) => setEditOrg(e.target.value)}
                placeholder="Nome da organização"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Contato</label>
              <input
                type="text"
                value={editContato}
                onChange={(e) => setEditContato(e.target.value)}
                placeholder="Nome do contato"
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Equipamento</label>
              <input
                type="text"
                value={editEquipamento}
                onChange={(e) => setEditEquipamento(e.target.value)}
                placeholder="Identificação do equipamento"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              style={btnPrimary}
              disabled={isPending}
              onClick={handleSalvarCampos}
            >
              {isPending ? "Salvando…" : "Salvar campos"}
            </button>
            {camposSalvos && (
              <span style={{ fontSize: 12, color: "#065F46" }}>
                ✓ Campos atualizados
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Histórico (trilha de auditoria) ── */}
      <div style={sectionStyle}>
        <p style={sectionTitle}>Histórico</p>
        {trilha.length === 0 ? (
          <p style={{ fontSize: 13, color: FG_3, margin: 0 }}>Nenhum registro de histórico.</p>
        ) : (
          <div>
            {[...trilha]
              .sort(
                (a, b) =>
                  new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
              )
              .map((item) => (
                <TrilhaRow key={item.id} item={item} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
