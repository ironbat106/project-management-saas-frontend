import { type NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/backend";
import { ACCESS_COOKIE } from "@/lib/constants";

async function forward(
  request: NextRequest,
  context: RouteContext<"/api/proxy/[...path]">,
) {
  const { path } = await context.params;

  if (path[0] === "auth") {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 },
    );
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const hasBody = request.method === "POST" || request.method === "PATCH";
  const body = hasBody ? await request.text() : "";

  try {
    const upstream = await fetch(
      `${getApiBaseUrl()}/${path.join("/")}${request.nextUrl.search}`,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body || undefined,
        cache: "no-store",
      },
    );

    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Could not reach the server. Please try again.",
      },
      { status: 503 },
    );
  }
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
