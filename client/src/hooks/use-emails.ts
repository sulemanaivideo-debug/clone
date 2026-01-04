import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type EmailInput } from "@shared/routes";

// GET /api/emails
export function useEmails() {
  return useQuery({
    queryKey: [api.emails.list.path],
    queryFn: async () => {
      const res = await fetch(api.emails.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch emails");
      return api.emails.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/emails/:id
export function useEmail(id: number) {
  return useQuery({
    queryKey: [api.emails.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.emails.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch email details");
      return api.emails.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

// POST /api/emails
export function useCreateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EmailInput) => {
      const res = await fetch(api.emails.create.path, {
        method: api.emails.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.emails.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send email");
      }
      return api.emails.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
    },
  });
}

// PATCH /api/emails/:id/star
export function useToggleStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isStarred }: { id: number; isStarred: boolean }) => {
      const url = buildUrl(api.emails.toggleStar.path, { id });
      const res = await fetch(url, {
        method: api.emails.toggleStar.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update star status");
      return api.emails.toggleStar.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate list to refresh UI
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      // Also update specific email if it's open
      queryClient.setQueryData([api.emails.get.path, data.id], data);
    },
  });
}
