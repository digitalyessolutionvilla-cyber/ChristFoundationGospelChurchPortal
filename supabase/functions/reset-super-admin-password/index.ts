const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// One-time password reset already performed. Disabled to prevent replay.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return new Response(
    JSON.stringify({ success: false, error: "This function has been disabled." }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
