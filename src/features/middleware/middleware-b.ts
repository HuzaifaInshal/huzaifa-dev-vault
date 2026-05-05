import { NextRequest, NextResponse } from "next/server";

export async function MiddlewareB(request: NextRequest) {
  return NextResponse.next();
}
