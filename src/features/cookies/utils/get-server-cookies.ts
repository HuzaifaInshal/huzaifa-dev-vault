import { cookies } from "next/headers";

export const getCookiesForServer = async () => {
  const cookieStore = await cookies();
  const cookieStringified = cookieStore.toString();

  return cookieStringified;
};
