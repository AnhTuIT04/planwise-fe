function __validateEnvVariable(variable: string | undefined, name: string): string {
  if (!variable) throw new Error(`Environment variable ${name} is not defined.`);

  return variable;
}

export const apiBaseURL = __validateEnvVariable(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL");
export const googleClientId = __validateEnvVariable(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID");
export const googleClientSecret = __validateEnvVariable(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET");
export const githubClientId = __validateEnvVariable(process.env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID");
export const githubClientSecret = __validateEnvVariable(process.env.GITHUB_CLIENT_SECRET, "GITHUB_CLIENT_SECRET");
