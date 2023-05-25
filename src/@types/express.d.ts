declare namespace Express {
  export interface Request {
    userToken: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }
}
