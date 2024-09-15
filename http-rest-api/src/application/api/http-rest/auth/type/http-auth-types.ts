export type HttpUserPayload = {
  id: string;
  email: string;
};

export type HttpRequestWithUser = Request & { user: HttpUserPayload };

export type HttpJwtPayload = {
  id: string;
};

export type HttpSignedUser = {
  id: string;
  accessToken: string;
};
