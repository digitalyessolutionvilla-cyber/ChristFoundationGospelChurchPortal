import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const SUPER_ADMIN_EMAIL = "delightdesign.org@gmail.com";
    const SUPER_ADMIN_PASSWORD = "Iamblessed@1";
    const SUPER_ADMIN_NAME = "Super Administrator";

    // Check if super admin already exists
    const { data: existingProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("role_slug", "super_admin")
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ success: true, message: "Super admin already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the user via admin API
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: SUPER_ADMIN_NAME },
    });

    if (createError) {
      // If user already exists in auth, find them
      if (createError.message.includes("already been registered")) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = listData?.users?.find(u => u.email === SUPER_ADMIN_EMAIL);
        
        if (existingUser) {
          // Create admin profile for existing user
          const { error: profileError } = await supabaseAdmin
            .from("admin_profiles")
            .upsert({
              user_id: existingUser.id,
              full_name: SUPER_ADMIN_NAME,
              role_slug: "super_admin",
              is_active: true,
            }, { onConflict: "user_id" });

          if (profileError) {
            return new Response(
              JSON.stringify({ success: false, error: profileError.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({ success: true, message: "Super admin profile created for existing user" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ success: false, error: createError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin profile
    const { error: profileError } = await supabaseAdmin
      .from("admin_profiles")
      .insert({
        user_id: userData.user.id,
        full_name: SUPER_ADMIN_NAME,
        role_slug: "super_admin",
        is_active: true,
      });

    if (profileError) {
      return new Response(
        JSON.stringify({ success: false, error: profileError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Super admin created successfully", email: SUPER_ADMIN_EMAIL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});