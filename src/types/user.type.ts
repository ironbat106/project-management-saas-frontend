export type Role = "ADMIN" | "OWNER" | "MEMBER";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  authProvider: "CREDENTIAL" | "GOOGLE";
  needPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}
