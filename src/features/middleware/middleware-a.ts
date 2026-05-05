import { NextRequest, NextResponse } from "next/server";

export async function MiddlewareA(request: NextRequest) {
  return NextResponse.next();
}
