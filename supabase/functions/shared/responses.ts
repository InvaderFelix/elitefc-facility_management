import { AppError } from "./errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function jsonSuccess(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function jsonError(error: unknown): Response {
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { message: error.message, code: error.code },
      }),
      {
        status: error.statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  console.error("Unhandled error:", error);
  return new Response(
    JSON.stringify({
      success: false,
      error: { message: "Internal server error" },
    }),
    {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

export function corsResponse(): Response {
  return new Response("ok", { status: 204, headers: corsHeaders });
}
