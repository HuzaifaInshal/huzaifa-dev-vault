import { NextRequest, NextResponse } from "next/server";

type MiddlewareFn = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/**
 * Runs middlewares sequentially.
 * Stops on the first middleware that does NOT return `NextResponse.next()`
 * NextResponse.next() will have result.ok === true and result.redirected === false
 */
export async function composeMiddlewares(
  req: NextRequest,
  middlewares: MiddlewareFn[],
): Promise<NextResponse> {
  const finalRes = NextResponse.next();

  for (const mw of middlewares) {
    const result = await mw(req);

    // 🔹 Copy all headers from this middleware to the final response
    result.headers.forEach((value, key) => {
      finalRes.headers.set(key, value);
    });

    // 🔹 Copy all cookies from this middleware to the final response
    result.cookies.getAll().forEach((cookie) => {
      finalRes.cookies.set(cookie);
    });

    // 🔹 If a middleware returns a redirect or non-OK response, stop chain
    if (result.redirected || !result.ok) {
      return result;
    }
  }

  return finalRes;
}
