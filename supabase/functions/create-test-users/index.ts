import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestUser {
  email: string;
  password: string;
  fullName: string;
  employeeCode: string | null;
  jobTitle: string;
  orgUnitId: string | null;
  roleName: string;
}

const testUsers: TestUser[] = [
  {
    email: "admin@tribunal.ao",
    password: "Admin123!",
    fullName: "Carlos Administrador",
    employeeCode: "TC001",
    jobTitle: "Administrador de Sistemas",
    orgUnitId: "a0000000-0000-0000-0000-000000000004",
    roleName: "ADMIN",
  },
  {
    email: "rh@tribunal.ao",
    password: "RH123456!",
    fullName: "Ana Recursos Humanos",
    employeeCode: "TC002",
    jobTitle: "Técnica de RH",
    orgUnitId: "a0000000-0000-0000-0000-000000000003",
    roleName: "RH",
  },
  {
    email: "auditor@tribunal.ao",
    password: "Auditor123!",
    fullName: "João Auditor",
    employeeCode: "TC003",
    jobTitle: "Auditor Interno",
    orgUnitId: "a0000000-0000-0000-0000-000000000002",
    roleName: "AUDITOR",
  },
  {
    email: "avaliador@tribunal.ao",
    password: "Avaliador123!",
    fullName: "Maria Avaliadora",
    employeeCode: "TC004",
    jobTitle: "Coordenadora de Secção",
    orgUnitId: "a0000000-0000-0000-0000-000000000005",
    roleName: "AVALIADOR",
  },
  {
    email: "avaliado@tribunal.ao",
    password: "Avaliado123!",
    fullName: "Pedro Avaliado",
    employeeCode: "TC005",
    jobTitle: "Técnico Superior",
    orgUnitId: "a0000000-0000-0000-0000-000000000005",
    roleName: "AVALIADO",
  },
  {
    email: "par@tribunal.ao",
    password: "Par12345!",
    fullName: "Sofia Par",
    employeeCode: "TC006",
    jobTitle: "Técnica Superior",
    orgUnitId: "a0000000-0000-0000-0000-000000000005",
    roleName: "PAR",
  },
  {
    email: "utente.interno@tribunal.ao",
    password: "Interno123!",
    fullName: "Miguel Interno",
    employeeCode: "TC007",
    jobTitle: "Assistente Técnico",
    orgUnitId: "a0000000-0000-0000-0000-000000000002",
    roleName: "UTENTE_INTERNO",
  },
  {
    email: "utente.externo@tribunal.ao",
    password: "Externo123!",
    fullName: "Rita Externa",
    employeeCode: null,
    jobTitle: "Cidadã",
    orgUnitId: null,
    roleName: "UTENTE_EXTERNO",
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting test users creation...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: { email: string; status: string; error?: string }[] = [];

    // Get all roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('roles')
      .select('id, name');

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      throw new Error(`Failed to fetch roles: ${rolesError.message}`);
    }

    console.log(`Found ${roles?.length} roles`);

    for (const testUser of testUsers) {
      console.log(`Processing user: ${testUser.email}`);

      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === testUser.email);

        let userId: string;

        if (existingUser) {
          console.log(`User ${testUser.email} already exists, skipping creation`);
          userId = existingUser.id;
          results.push({ email: testUser.email, status: "already_exists" });
        } else {
          // Create user in auth.users
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: testUser.email,
            password: testUser.password,
            email_confirm: true,
            user_metadata: {
              full_name: testUser.fullName,
            },
          });

          if (authError) {
            console.error(`Error creating auth user ${testUser.email}:`, authError);
            results.push({ email: testUser.email, status: "error", error: authError.message });
            continue;
          }

          userId = authData.user.id;
          console.log(`Created auth user: ${testUser.email} with id: ${userId}`);
        }

        // Update profile with additional data
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            full_name: testUser.fullName,
            employee_code: testUser.employeeCode,
            job_title: testUser.jobTitle,
            org_unit_id: testUser.orgUnitId,
          })
          .eq('id', userId);

        if (profileError) {
          console.error(`Error updating profile for ${testUser.email}:`, profileError);
        } else {
          console.log(`Updated profile for: ${testUser.email}`);
        }

        // Find role and assign
        const role = roles?.find(r => r.name === testUser.roleName);
        if (role) {
          // Check if role already assigned
          const { data: existingRole } = await supabaseAdmin
            .from('user_roles')
            .select('id')
            .eq('user_id', userId)
            .eq('role_id', role.id)
            .maybeSingle();

          if (!existingRole) {
            const { error: roleError } = await supabaseAdmin
              .from('user_roles')
              .insert({
                user_id: userId,
                role_id: role.id,
                scope_type: 'GLOBAL',
              });

            if (roleError) {
              console.error(`Error assigning role to ${testUser.email}:`, roleError);
            } else {
              console.log(`Assigned role ${testUser.roleName} to: ${testUser.email}`);
            }
          } else {
            console.log(`Role ${testUser.roleName} already assigned to: ${testUser.email}`);
          }
        }

        if (!existingUser) {
          results.push({ email: testUser.email, status: "created" });
        }
      } catch (userError: any) {
        console.error(`Error processing user ${testUser.email}:`, userError);
        results.push({ email: testUser.email, status: "error", error: userError.message });
      }
    }

    console.log("Test users creation completed");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test users creation completed",
        results,
        credentials: testUsers.map(u => ({
          email: u.email,
          password: u.password,
          role: u.roleName,
        })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in create-test-users function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});