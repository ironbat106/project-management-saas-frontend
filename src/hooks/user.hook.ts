"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "@/api";
import { browserRequest } from "@/lib/request-browser";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (body: { name: string }) =>
      userApi.update(browserRequest, body),
    onSuccess: () => toast.success("Profile updated"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) =>
      userApi.changePassword(browserRequest, body),
    onSuccess: () => toast.success("Password changed"),
  });
}
