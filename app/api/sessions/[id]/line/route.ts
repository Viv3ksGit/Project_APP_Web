import { parseUpdateLineInput } from "@/lib/domain/validation";
import { badRequest, ok, unauthorized } from "@/lib/server/http";
import { updateSessionLine } from "@/lib/server/session-store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const input = parseUpdateLineInput(payload);
    const session = updateSessionLine(id, input);
    return ok({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update session line.";
    if (message.includes("Host key")) {
      return unauthorized(message);
    }
    return badRequest(message);
  }
}

