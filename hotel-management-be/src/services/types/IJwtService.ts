export type TokenPayload = {
  id: string;
  role: string;
  username: string;
};

export type IJwtService = {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): TokenPayload;
};
