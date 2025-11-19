"use client";
import client from "@/lib/hono/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.notes.recentNotes.$get
>;

export const useRecentNotes = (options?: any) => {
  return useQuery<Response>({
    queryKey: ["recentNotes"],
    queryFn: async () => {
      const res = await client.api.notes.recentNotes.$get();
      return (await res.json()) as Response;
    },
    ...options,
  });
};
