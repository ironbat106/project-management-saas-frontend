import type { Requester, User } from "@/types";

export const userApi = {
  me: (request: Requester) => request<User>("/users/me"),

  update: (request: Requester, body: { name: string }) =>
    request<User>("/users/me", { method: "PATCH", body }),

  changePassword: (
    request: Requester,
    body: { oldPassword: string; newPassword: string },
  ) => request<null>("/users/me/change-password", { method: "PATCH", body }),
};
