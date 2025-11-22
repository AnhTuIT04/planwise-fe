/**
 * The route to redirect to after successful authentication.
 * @type {string}
 */
export const REDIRECT_AFTER_AUTH: string = "/my-tasks";

/**
 * The route to redirect to if the user is not authenticated.
 * @type {string}
 */
export const REDIRECT_IF_NOT_AUTH: string = "/sign-in";

/**
 * Routes related to authentication (sign in, register, etc.).
 * If a user is already logged in, navigating to these will redirect them to REDIRECT_AFTER_AUTH.
 * @type {string[]}
 */
export const AUTH_ROUTES: string[] = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/sign-up/verify",
  "/forgot-password/verify",
  "/forgot-password/reset",
];

/**
 * Publicly accessible routes that do not require authentication.
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = ["/"].concat(AUTH_ROUTES);

/**
 * Checks if a given route is publicly accessible (does not require authentication).
 * @param {string} route - The route to check.
 * @returns {boolean} True if the route is public, false otherwise.
 */
export function isPublicRoute(route: string): boolean {
  return PUBLIC_ROUTES.includes(route);
}
