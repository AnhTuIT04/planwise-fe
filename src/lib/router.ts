/**
 * Publicly accessible routes that do not require authentication.
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = ["/"];

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
export const AUTH_ROUTES: string[] = ["/sign-in", "/sign-up", "/forgot-password", "/sign-up/verify", "/forgot-password/verify", "/forgot-password/reset"];
