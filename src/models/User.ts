export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserData = {
  email: string;
  password_hash: string;
};
