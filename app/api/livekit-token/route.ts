import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const room = searchParams.get("room");
  const user = searchParams.get("user");

  if (!room || !user) {
    return new NextResponse("Missing room or user", { status: 400 });
  }

  const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: user,
    name: user,
  });

  token.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return new NextResponse(await token.toJwt(), {
    headers: { "Content-Type": "text/plain" },
  });
}
