export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ciclos_avaliacao: {
        Row: {
          ano: number
          created_at: string
          data_fim: string
          data_inicio: string
          estado: string
          id: string
          semestre: number | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          data_fim: string
          data_inicio: string
          estado?: string
          id?: string
          semestre?: number | null
          tipo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_fim?: string
          data_inicio?: string
          estado?: string
          id?: string
          semestre?: number | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      comissao_avaliacao: {
        Row: {
          cargo_comissao: string
          ciclo_id: string
          created_at: string
          data_cessacao: string | null
          data_nomeacao: string
          id: string
          observacoes: string | null
          ordem: number
          tipo_membro: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cargo_comissao: string
          ciclo_id: string
          created_at?: string
          data_cessacao?: string | null
          data_nomeacao?: string
          id?: string
          observacoes?: string | null
          ordem: number
          tipo_membro: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cargo_comissao?: string
          ciclo_id?: string
          created_at?: string
          data_cessacao?: string | null
          data_nomeacao?: string
          id?: string
          observacoes?: string | null
          ordem?: number
          tipo_membro?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comissao_avaliacao_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_comissao_ciclo"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos_avaliacao"
            referencedColumns: ["id"]
          },
        ]
      }
      help_content: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          keywords: string[] | null
          legal_references: string[] | null
          related_links: Json | null
          route: string
          sections: Json | null
          tips: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          keywords?: string[] | null
          legal_references?: string[] | null
          related_links?: Json | null
          route: string
          sections?: Json | null
          tips?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          keywords?: string[] | null
          legal_references?: string[] | null
          related_links?: Json | null
          route?: string
          sections?: Json | null
          tips?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      org_units: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          employee_code: string | null
          full_name: string
          id: string
          job_title: string | null
          org_unit_id: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          employee_code?: string | null
          full_name: string
          id: string
          job_title?: string | null
          org_unit_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          employee_code?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          org_unit_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_unit_id_fkey"
            columns: ["org_unit_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reclamacoes: {
        Row: {
          avaliacao_id: string
          avaliador_id: string
          ciclo_id: string
          created_at: string
          data_limite_resposta: string | null
          data_resposta: string | null
          data_submissao: string
          decisao_avaliador: string | null
          documentos_anexos: string[] | null
          estado: string
          fundamentacao: string
          id: string
          motivo: string
          reclamante_id: string
          resposta_avaliador: string | null
          updated_at: string
        }
        Insert: {
          avaliacao_id: string
          avaliador_id: string
          ciclo_id: string
          created_at?: string
          data_limite_resposta?: string | null
          data_resposta?: string | null
          data_submissao?: string
          decisao_avaliador?: string | null
          documentos_anexos?: string[] | null
          estado?: string
          fundamentacao: string
          id?: string
          motivo: string
          reclamante_id: string
          resposta_avaliador?: string | null
          updated_at?: string
        }
        Update: {
          avaliacao_id?: string
          avaliador_id?: string
          ciclo_id?: string
          created_at?: string
          data_limite_resposta?: string | null
          data_resposta?: string | null
          data_submissao?: string
          decisao_avaliador?: string | null
          documentos_anexos?: string[] | null
          estado?: string
          fundamentacao?: string
          id?: string
          motivo?: string
          reclamante_id?: string
          resposta_avaliador?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reclamacoes_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reclamacoes_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos_avaliacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reclamacoes_reclamante_id_fkey"
            columns: ["reclamante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recursos: {
        Row: {
          ciclo_id: string
          created_at: string
          data_decisao: string | null
          data_limite_decisao: string | null
          data_submissao: string
          decisao: string | null
          documentos_anexos: string[] | null
          estado: string
          fundamentacao: string
          fundamentacao_decisao: string | null
          id: string
          membro_relator_id: string | null
          motivo: string
          reclamacao_id: string | null
          recorrente_id: string
          updated_at: string
          votos: Json | null
        }
        Insert: {
          ciclo_id: string
          created_at?: string
          data_decisao?: string | null
          data_limite_decisao?: string | null
          data_submissao?: string
          decisao?: string | null
          documentos_anexos?: string[] | null
          estado?: string
          fundamentacao: string
          fundamentacao_decisao?: string | null
          id?: string
          membro_relator_id?: string | null
          motivo: string
          reclamacao_id?: string | null
          recorrente_id: string
          updated_at?: string
          votos?: Json | null
        }
        Update: {
          ciclo_id?: string
          created_at?: string
          data_decisao?: string | null
          data_limite_decisao?: string | null
          data_submissao?: string
          decisao?: string | null
          documentos_anexos?: string[] | null
          estado?: string
          fundamentacao?: string
          fundamentacao_decisao?: string | null
          id?: string
          membro_relator_id?: string | null
          motivo?: string
          reclamacao_id?: string | null
          recorrente_id?: string
          updated_at?: string
          votos?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "recursos_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "ciclos_avaliacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_membro_relator_id_fkey"
            columns: ["membro_relator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_reclamacao_id_fkey"
            columns: ["reclamacao_id"]
            isOneToOne: false
            referencedRelation: "reclamacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_recorrente_id_fkey"
            columns: ["recorrente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["scope_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["scope_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["scope_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_scope_id_fkey"
            columns: ["scope_id"]
            isOneToOne: false
            referencedRelation: "org_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_users: { Args: { _user_id: string }; Returns: boolean }
      can_view_audit: { Args: { _user_id: string }; Returns: boolean }
      get_user_status: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_status"]
      }
      has_permission: {
        Args: { _permission_code: string; _user_id: string }
        Returns: boolean
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_user_active: { Args: { _user_id: string }; Returns: boolean }
      log_audit: {
        Args: {
          _action: string
          _actor_user_id: string
          _entity_id?: string
          _entity_type: string
          _metadata?: Json
        }
        Returns: string
      }
      search_help_content: {
        Args: { search_query: string }
        Returns: {
          created_at: string
          description: string
          icon: string | null
          id: string
          keywords: string[] | null
          legal_references: string[] | null
          related_links: Json | null
          route: string
          sections: Json | null
          tips: string[] | null
          title: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "help_content"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role:
        | "ADMIN"
        | "RH"
        | "AVALIADOR"
        | "AVALIADO"
        | "PAR"
        | "UTENTE_INTERNO"
        | "UTENTE_EXTERNO"
        | "AUDITOR"
      scope_type: "GLOBAL" | "ORG_UNIT"
      user_status: "ACTIVE" | "INACTIVE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "ADMIN",
        "RH",
        "AVALIADOR",
        "AVALIADO",
        "PAR",
        "UTENTE_INTERNO",
        "UTENTE_EXTERNO",
        "AUDITOR",
      ],
      scope_type: ["GLOBAL", "ORG_UNIT"],
      user_status: ["ACTIVE", "INACTIVE"],
    },
  },
} as const
