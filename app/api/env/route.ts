import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME,
    NODE_ENV: process.env.NODE_ENV,
  });
}