export const PROTECTED_ROUTES = [
  "/",
  "/analytics",
  "/transactions",
  "/payment",
  "/plan",
  "/cards",
] as const;

export const PUBLIC_ROUTES = ["/login", "/signup"] as const;
