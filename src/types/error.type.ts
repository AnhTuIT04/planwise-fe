export class AuthError extends Error {
  status: number;
  name: string;
  digest: string;

  constructor(message: string = "Unauthorized", status: number = 401) {
    super(message);
    this.status = status;
    this.name = "AuthError";
    this.digest = `AUTH_ERROR_${status}`;
  }
}
