import { parseCreateSessionInput } from "@/lib/domain/validation";
import { badRequest, ok } from "@/lib/server/http";
import { createSession, listSessions } from "@/lib/server/session-store";

export async function GET() {
  return ok({ sessions: listSessions() });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseCreateSessionInput(payload);
    const session = createSession(input);
    return ok({ session }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create session.";
    return badRequest(message);
  }
}

