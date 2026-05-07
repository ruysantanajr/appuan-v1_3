export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      area: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          id: string
          nome: string
          sigla: string
          status: string
          tipo: string
          usuario_id: string | null
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          nome: string
          sigla: string
          status?: string
          tipo: string
          usuario_id?: string | null
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          nome?: string
          sigla?: string
          status?: string
          tipo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "area_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      area_fluxo: {
        Row: {
          area_id: string
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          fluxo_id: string
          id: string
          status: string
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          fluxo_id: string
          id?: string
          status?: string
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          fluxo_id?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_fluxo_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_fluxo_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_fluxo_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_fluxo_fluxo_id_fkey"
            columns: ["fluxo_id"]
            isOneToOne: false
            referencedRelation: "fluxo"
            referencedColumns: ["id"]
          },
        ]
      }
      area_usuario: {
        Row: {
          area_id: string
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          id: string
          papel: string
          status: string
          usuario_id: string
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          papel: string
          status?: string
          usuario_id: string
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          papel?: string
          status?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_usuario_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_usuario_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_usuario_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      contato: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          cargo: string | null
          criado_em: string
          criado_por: string
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          organizacao_id: string | null
          status: string
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          cargo?: string | null
          criado_em?: string
          criado_por?: string
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          organizacao_id?: string | null
          status?: string
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          cargo?: string | null
          criado_em?: string
          criado_por?: string
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          organizacao_id?: string | null
          status?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contato_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacao"
            referencedColumns: ["id"]
          },
        ]
      }
      demanda: {
        Row: {
          area_id: string
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          descricao: string
          id: string
          origem: string
          status: string
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao: string
          id?: string
          origem: string
          status?: string
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string
          id?: string
          origem?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "demanda_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demanda_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demanda_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      etapa: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          descricao: string | null
          fluxo_id: string
          id: string
          migra_para_fluxo_id: string | null
          nome: string
          ordem: number
          status_gatilho: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          fluxo_id: string
          id?: string
          migra_para_fluxo_id?: string | null
          nome: string
          ordem: number
          status_gatilho?: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          fluxo_id?: string
          id?: string
          migra_para_fluxo_id?: string | null
          nome?: string
          ordem?: number
          status_gatilho?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapa_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etapa_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etapa_fluxo_id_fkey"
            columns: ["fluxo_id"]
            isOneToOne: false
            referencedRelation: "fluxo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etapa_migra_para_fluxo_id_fkey"
            columns: ["migra_para_fluxo_id"]
            isOneToOne: false
            referencedRelation: "fluxo"
            referencedColumns: ["id"]
          },
        ]
      }
      fluxo: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          descricao: string | null
          id: string
          nome: string
          status: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fluxo_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fluxo_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamento: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          descricao: string | null
          id: string
          marca: string | null
          numero_serie: string | null
          status: string
          tag: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          marca?: string | null
          numero_serie?: string | null
          status?: string
          tag: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          marca?: string | null
          numero_serie?: string | null
          status?: string
          tag?: string
          tipo?: string
        }
        Relationships: []
      }
      organizacao: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          site: string | null
          status: string
          telefone: string | null
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          site?: string | null
          status?: string
          telefone?: string | null
          tipo: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          site?: string | null
          status?: string
          telefone?: string | null
          tipo?: string
        }
        Relationships: []
      }
      projeto: {
        Row: {
          area_id: string
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          descricao: string | null
          id: string
          nome: string
          status: string
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projeto_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      projeto_usuario: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          criado_em: string
          criado_por: string
          id: string
          papel: string
          projeto_id: string
          status: string
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          papel: string
          projeto_id: string
          status?: string
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          criado_em?: string
          criado_por?: string
          id?: string
          papel?: string
          projeto_id?: string
          status?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projeto_usuario_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_usuario_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_usuario_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      requisicao: {
        Row: {
          area_id: string
          atualizado_em: string
          atualizado_por: string
          contato: string | null
          criado_em: string
          criado_por: string
          demanda_id: string | null
          descricao: string | null
          equipamento: string | null
          etapa_id: string
          fluxo_id: string
          id: string
          numero: string
          organizacao: string | null
          prazo: string | null
          projeto_id: string | null
          responsavel_id: string | null
          status: string
          titulo: string
        }
        Insert: {
          area_id: string
          atualizado_em?: string
          atualizado_por?: string
          contato?: string | null
          criado_em?: string
          criado_por?: string
          demanda_id?: string | null
          descricao?: string | null
          equipamento?: string | null
          etapa_id: string
          fluxo_id: string
          id?: string
          numero: string
          organizacao?: string | null
          prazo?: string | null
          projeto_id?: string | null
          responsavel_id?: string | null
          status?: string
          titulo: string
        }
        Update: {
          area_id?: string
          atualizado_em?: string
          atualizado_por?: string
          contato?: string | null
          criado_em?: string
          criado_por?: string
          demanda_id?: string | null
          descricao?: string | null
          equipamento?: string | null
          etapa_id?: string
          fluxo_id?: string
          id?: string
          numero?: string
          organizacao?: string | null
          prazo?: string | null
          projeto_id?: string | null
          responsavel_id?: string | null
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "requisicao_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_demanda_id_fkey"
            columns: ["demanda_id"]
            isOneToOne: false
            referencedRelation: "demanda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_fluxo_id_fkey"
            columns: ["fluxo_id"]
            isOneToOne: false
            referencedRelation: "fluxo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      requisicao_tag: {
        Row: {
          criado_em: string
          criado_por: string
          id: string
          requisicao_id: string
          tag_id: string
        }
        Insert: {
          criado_em?: string
          criado_por?: string
          id?: string
          requisicao_id: string
          tag_id: string
        }
        Update: {
          criado_em?: string
          criado_por?: string
          id?: string
          requisicao_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requisicao_tag_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_tag_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "requisicao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      tag: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          cor: string | null
          criado_em: string
          criado_por: string
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          cor?: string | null
          criado_em?: string
          criado_por?: string
          id?: string
          nome: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          cor?: string | null
          criado_em?: string
          criado_por?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      trilha_auditoria: {
        Row: {
          criado_em: string
          criado_por: string
          dados_antes: Json | null
          dados_depois: Json | null
          id: string
          operacao: string
          registro_id: string
          tabela: string
        }
        Insert: {
          criado_em?: string
          criado_por?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          id?: string
          operacao: string
          registro_id: string
          tabela: string
        }
        Update: {
          criado_em?: string
          criado_por?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          id?: string
          operacao?: string
          registro_id?: string
          tabela?: string
        }
        Relationships: [
          {
            foreignKeyName: "trilha_auditoria_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario: {
        Row: {
          atualizado_em: string
          atualizado_por: string
          avatar_url: string | null
          criado_em: string
          criado_por: string
          email: string
          id: string
          nome: string
          status: string
          telefone: string | null
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          atualizado_por?: string
          avatar_url?: string | null
          criado_em?: string
          criado_por?: string
          email: string
          id?: string
          nome: string
          status?: string
          telefone?: string | null
          tipo: string
        }
        Update: {
          atualizado_em?: string
          atualizado_por?: string
          avatar_url?: string | null
          criado_em?: string
          criado_por?: string
          email?: string
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]

export const Constants = {
  public: {
    Enums: {},
  },
} as const
