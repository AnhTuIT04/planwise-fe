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
  "/oauth/success",
  "/forgot-password",
  "/sign-up/verify",
  "/forgot-password/verify",
  "/forgot-password/reset",
];

/**
 * Publicly accessible routes that do not require authentication.
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = ["/", "/invite-member"];

/** * Checks if a given pathname is a public route.
 * @param {string} pathname - The pathname to check.
 * @returns {boolean} True if the pathname is a public route, false otherwise.
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.concat(AUTH_ROUTES).includes(pathname);
}
