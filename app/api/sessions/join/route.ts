import { parseJoinSessionInput } from "@/lib/domain/validation";
import { badRequest, ok } from "@/lib/server/http";
import { joinSessionByInvite } from "@/lib/server/session-store";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseJoinSessionInput(payload);
    const session = joinSessionByInvite(input.inviteCode);
    return ok({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to join session.";
    return badRequest(message);
  }
}
