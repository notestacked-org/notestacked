"use client";
import client from "@/lib/hono/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.workspace.getWorkspaces.$get>;

export const useWorkspaces = () => {
  return useQuery<ResponseType>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await client.api.workspace.getWorkspaces.$get();
      return await res.json() as ResponseType;
    },
  });
};
