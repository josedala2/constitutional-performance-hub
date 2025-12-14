-- =====================================================
-- SGAD - Sistema de Gestão de Avaliação de Desempenho
-- Módulo de Gestão de Utilizadores, Perfis, RBAC e Auditoria
-- =====================================================

-- 1. ENUM TYPES
-- =====================================================

-- Status do utilizador
CREATE TYPE public.user_status AS ENUM ('ACTIVE', 'INACTIVE');

-- Tipo de scope para atribuição de roles
CREATE TYPE public.scope_type AS ENUM ('GLOBAL', 'ORG_UNIT');

-- Roles do sistema
CREATE TYPE public.app_role AS ENUM (
  'ADMIN', 
  'RH', 
  'AVALIADOR', 
  'AVALIADO', 
  'PAR', 
  'UTENTE_INTERNO', 
  'UTENTE_EXTERNO', 
  'AUDITOR'
);

-- 2. TABELAS PRINCIPAIS
-- =====================================================

-- 2.1 Unidades Orgânicas (org_units)
CREATE TABLE public.org_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.org_units(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Perfis de utilizadores (profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  employee_code TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  job_title TEXT,
  org_unit_id UUID REFERENCES public.org_units(id) ON DELETE SET NULL,
  status public.user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Perfis/Roles do sistema (roles)
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Permissões (permissions)
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Role-Permissions (N:N)
CREATE TABLE public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 2.6 User-Roles com contexto (N:N)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  scope_type public.scope_type NOT NULL DEFAULT 'GLOBAL',
  scope_id UUID REFERENCES public.org_units(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role_id, scope_type, scope_id)
);

-- 2.7 Logs de Auditoria (audit_logs)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ÍNDICES
-- =====================================================
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_org_unit ON public.profiles(org_unit_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role_id);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_org_units_parent ON public.org_units(parent_id);

-- 4. FUNÇÕES DE SEGURANÇA
-- =====================================================

-- Função para verificar se utilizador tem um role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name = _role
  );
$$;

-- Função para verificar se utilizador é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'ADMIN');
$$;

-- Função para verificar se utilizador tem permissão específica
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.code = _permission_code
  ) OR public.is_admin(_user_id);
$$;

-- Função para verificar se utilizador pode gerir users
CREATE OR REPLACE FUNCTION public.can_manage_users(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) 
    OR public.has_role(_user_id, 'RH');
$$;

-- Função para verificar se utilizador pode ver auditoria
CREATE OR REPLACE FUNCTION public.can_view_audit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) 
    OR public.has_role(_user_id, 'RH')
    OR public.has_role(_user_id, 'AUDITOR');
$$;

-- Função para obter status do utilizador
CREATE OR REPLACE FUNCTION public.get_user_status(_user_id UUID)
RETURNS public.user_status
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status FROM public.profiles WHERE id = _user_id;
$$;

-- Função para verificar se utilizador está ativo
CREATE OR REPLACE FUNCTION public.is_user_active(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status = 'ACTIVE' FROM public.profiles WHERE id = _user_id;
$$;

-- 5. TRIGGER PARA UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. FUNÇÃO PARA REGISTAR AUDITORIA
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_audit(
  _actor_user_id UUID,
  _action TEXT,
  _entity_type TEXT,
  _entity_id UUID DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (_actor_user_id, _action, _entity_type, _entity_id, _metadata)
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- 8. ENABLE RLS
-- =====================================================
ALTER TABLE public.org_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES
-- =====================================================

-- ORG_UNITS: todos os autenticados podem ver
CREATE POLICY "Authenticated users can view org_units"
  ON public.org_units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and RH can manage org_units"
  ON public.org_units FOR ALL
  TO authenticated
  USING (public.can_manage_users(auth.uid()))
  WITH CHECK (public.can_manage_users(auth.uid()));

-- PROFILES: utilizadores podem ver o próprio, admin/RH podem ver todos
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.can_manage_users(auth.uid()) OR public.has_role(auth.uid(), 'AUDITOR'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins and RH can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.can_manage_users(auth.uid()))
  WITH CHECK (public.can_manage_users(auth.uid()));

-- ROLES: todos autenticados podem ver, apenas admin pode gerir
CREATE POLICY "Authenticated users can view roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- PERMISSIONS: admin, RH e auditor podem ver
CREATE POLICY "Admin RH Auditor can view permissions"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'RH') OR public.has_role(auth.uid(), 'AUDITOR'));

CREATE POLICY "Only admins can manage permissions"
  ON public.permissions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ROLE_PERMISSIONS: apenas admin pode gerir
CREATE POLICY "Admin RH Auditor can view role_permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'RH') OR public.has_role(auth.uid(), 'AUDITOR'));

CREATE POLICY "Only admins can manage role_permissions"
  ON public.role_permissions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- USER_ROLES: admin e RH podem gerir
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.can_manage_users(auth.uid()) OR public.has_role(auth.uid(), 'AUDITOR'));

CREATE POLICY "Admins and RH can manage user_roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.can_manage_users(auth.uid()))
  WITH CHECK (public.can_manage_users(auth.uid()));

-- AUDIT_LOGS: admin, RH e auditor podem ver (imutáveis - sem update/delete)
CREATE POLICY "Admin RH Auditor can view audit_logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.can_view_audit(auth.uid()));

CREATE POLICY "Authenticated users can insert audit_logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 10. SEED DATA - ROLES PADRÃO
-- =====================================================
INSERT INTO public.roles (name, description, is_system) VALUES
  ('ADMIN', 'Administrador do sistema com acesso total', true),
  ('RH', 'Recursos Humanos - gestão de utilizadores e visualização de auditoria', true),
  ('AVALIADOR', 'Avaliador - pode avaliar subordinados', true),
  ('AVALIADO', 'Avaliado - pode ver as suas avaliações', true),
  ('PAR', 'Par - pode participar em avaliações entre pares', true),
  ('UTENTE_INTERNO', 'Utente Interno - pode submeter avaliações internas', true),
  ('UTENTE_EXTERNO', 'Utente Externo - pode submeter avaliações anónimas', true),
  ('AUDITOR', 'Auditor - acesso apenas de leitura a logs e configurações', true);

-- 11. SEED DATA - PERMISSÕES PADRÃO
-- =====================================================
INSERT INTO public.permissions (code, description) VALUES
  -- Users
  ('users.manage.create', 'Criar novos utilizadores'),
  ('users.manage.read', 'Ver lista de utilizadores'),
  ('users.manage.update', 'Atualizar dados de utilizadores'),
  ('users.manage.disable', 'Desativar utilizadores'),
  ('users.manage.delete', 'Eliminar utilizadores'),
  -- Roles
  ('roles.manage.create', 'Criar novos perfis'),
  ('roles.manage.read', 'Ver lista de perfis'),
  ('roles.manage.update', 'Atualizar perfis'),
  ('roles.manage.delete', 'Eliminar perfis'),
  -- Permissions
  ('permissions.read', 'Ver lista de permissões'),
  ('permissions.assign', 'Atribuir permissões a perfis'),
  -- User Roles
  ('user_roles.assign', 'Atribuir perfis a utilizadores'),
  ('user_roles.remove', 'Remover perfis de utilizadores'),
  -- Org Units
  ('org_units.manage.create', 'Criar unidades orgânicas'),
  ('org_units.manage.read', 'Ver unidades orgânicas'),
  ('org_units.manage.update', 'Atualizar unidades orgânicas'),
  ('org_units.manage.delete', 'Eliminar unidades orgânicas'),
  -- Audit
  ('audit.read', 'Ver logs de auditoria'),
  -- Evaluations (placeholder para futuro)
  ('evaluations.create', 'Criar avaliações'),
  ('evaluations.read', 'Ver avaliações'),
  ('evaluations.update', 'Atualizar avaliações'),
  ('evaluations.delete', 'Eliminar avaliações'),
  ('evaluations.approve', 'Aprovar/homologar avaliações');

-- 12. SEED DATA - ATRIBUIÇÃO DE PERMISSÕES AOS ROLES
-- =====================================================

-- ADMIN: todas as permissões
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'ADMIN';

-- RH: gestão de utilizadores e auditoria
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'RH'
  AND p.code IN (
    'users.manage.create',
    'users.manage.read',
    'users.manage.update',
    'users.manage.disable',
    'roles.manage.read',
    'permissions.read',
    'user_roles.assign',
    'user_roles.remove',
    'org_units.manage.read',
    'org_units.manage.create',
    'org_units.manage.update',
    'audit.read'
  );

-- AUDITOR: apenas leitura
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'AUDITOR'
  AND p.code IN (
    'users.manage.read',
    'roles.manage.read',
    'permissions.read',
    'org_units.manage.read',
    'audit.read',
    'evaluations.read'
  );

-- AVALIADOR: avaliações
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'AVALIADOR'
  AND p.code IN (
    'evaluations.create',
    'evaluations.read',
    'evaluations.update'
  );

-- AVALIADO: ver próprias avaliações
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'AVALIADO'
  AND p.code IN ('evaluations.read');

-- 13. SEED DATA - UNIDADES ORGÂNICAS EXEMPLO
-- =====================================================
INSERT INTO public.org_units (id, name) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Presidência'),
  ('a0000000-0000-0000-0000-000000000002', 'Secretaria-Geral'),
  ('a0000000-0000-0000-0000-000000000003', 'Gabinete de Recursos Humanos'),
  ('a0000000-0000-0000-0000-000000000004', 'Gabinete de Informática'),
  ('a0000000-0000-0000-0000-000000000005', 'Gabinete Jurídico');

-- Hierarquia
UPDATE public.org_units SET parent_id = 'a0000000-0000-0000-0000-000000000001' 
WHERE name IN ('Secretaria-Geral');

UPDATE public.org_units SET parent_id = 'a0000000-0000-0000-0000-000000000002' 
WHERE name IN ('Gabinete de Recursos Humanos', 'Gabinete de Informática', 'Gabinete Jurídico');