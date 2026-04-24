function __validateEnvVariable(variable: string | undefined, name: string): string {
  if (!variable) throw new Error(`Environment variable ${name} is not defined.`);

  return variable;
}

export const apiURL = __validateEnvVariable(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL");
export const socketURL = __validateEnvVariable(process.env.NEXT_PUBLIC_SOCKET_URL, "NEXT_PUBLIC_SOCKET_URL");
export const apiUploadURL = __validateEnvVariable(process.env.NEXT_PUBLIC_API_UPLOAD_URL, "NEXT_PUBLIC_API_UPLOAD_URL");
