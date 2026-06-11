export const AUTH_COOKIE_NAME = "finflex_session";

export const PROTECTED_ROUTES = [
  "/",
  "/analytics",
  "/transactions",
  "/payment",
  "/plan",
  "/cards",
] as const;

export const PUBLIC_ROUTES = ["/login"] as const;
