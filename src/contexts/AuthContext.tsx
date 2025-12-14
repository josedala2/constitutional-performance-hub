import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole, Permission } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRoles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  isAdmin: boolean;
  isRH: boolean;
  isAuditor: boolean;
  canManageUsers: boolean;
  canViewAudit: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil e roles do utilizador
  const loadUserData = async (userId: string) => {
    try {
      // Carregar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          org_unit:org_units(id, name)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return;
      }

      setProfile(profileData);

      // Carregar roles do utilizador
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles(id, name, description, is_system),
          org_unit:org_units(id, name)
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Erro ao carregar roles:', rolesError);
        return;
      }

      setUserRoles(rolesData || []);

      // Carregar permissões do utilizador (através dos roles)
      if (rolesData && rolesData.length > 0) {
        const roleIds = rolesData.map(ur => ur.role_id);
        
        const { data: permData, error: permError } = await supabase
          .from('role_permissions')
          .select(`
            permission:permissions(code)
          `)
          .in('role_id', roleIds);

        if (permError) {
          console.error('Erro ao carregar permissões:', permError);
          return;
        }

        const permCodes = [...new Set(permData?.map(p => p.permission?.code).filter(Boolean) || [])];
        setPermissions(permCodes as string[]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do utilizador:', error);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  // Inicialização
  useEffect(() => {
    let mounted = true;

    // PRIMEIRO verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // DEPOIS configurar listener de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        // Carregar dados do utilizador de forma assíncrona
        if (session?.user) {
          setTimeout(() => {
            if (mounted) loadUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setPermissions([]);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Verificações de roles
  const hasRole = (roleName: string): boolean => {
    return userRoles.some(ur => ur.role?.name === roleName);
  };

  const isAdmin = hasRole('ADMIN');
  const isRH = hasRole('RH');
  const isAuditor = hasRole('AUDITOR');
  const canManageUsers = isAdmin || isRH;
  const canViewAudit = isAdmin || isRH || isAuditor;

  // Verificar permissão
  const hasPermission = (permissionCode: string): boolean => {
    if (isAdmin) return true; // Admin tem acesso total
    return permissions.includes(permissionCode);
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Log de auditoria
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase.rpc('log_audit', {
            _actor_user_id: currentUser.id,
            _action: 'LOGIN',
            _entity_type: 'SESSION',
            _entity_id: null,
            _metadata: { email }
          });
        }
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign Out
  const signOut = async () => {
    // Log de auditoria antes de logout
    if (user) {
      await supabase.rpc('log_audit', {
        _actor_user_id: user.id,
        _action: 'LOGOUT',
        _entity_type: 'SESSION',
        _entity_id: null,
        _metadata: {}
      });
    }

    await supabase.auth.signOut();
    setProfile(null);
    setUserRoles([]);
    setPermissions([]);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    userRoles,
    permissions,
    isLoading,
    isAdmin,
    isRH,
    isAuditor,
    canManageUsers,
    canViewAudit,
    hasPermission,
    hasRole,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
