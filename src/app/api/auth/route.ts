import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email si parola sunt obligatorii" },
        { status: 400 }
      );
    }

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: "Email sau parola incorecte" },
        { status: 401 }
      );
    }

    // Try to find the user in our player database by matching the name
    // from the dashboard, or fall back to empty (will be resolved client-side)
    const userName = result.userName || "";

    const response = NextResponse.json({
      success: true,
      email,
      userName,
    });

    response.cookies.set("fitasc_session", result.sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("fitasc_email", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    if (userName) {
      response.cookies.set("fitasc_name", userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Eroare la autentificare. Incercati din nou." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("fitasc_session");
  const email = request.cookies.get("fitasc_email");
  const name = request.cookies.get("fitasc_name");

  if (!session?.value) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    email: email?.value || "",
    userName: name?.value || "",
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  for (const cookieName of ["fitasc_session", "fitasc_email", "fitasc_name"]) {
    response.cookies.set(cookieName, "", {
      httpOnly: cookieName === "fitasc_session",
      maxAge: 0,
      path: "/",
    });
  }

  return response;
}
