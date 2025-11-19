"use client";
import client from "@/lib/hono/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.notes["getNotes"][":workspaceId"]["$get"]
>;

type Params = InferRequestType<
  typeof client.api.notes["getNotes"][":workspaceId"]["$get"]
>["param"];

export const useNotes = (params: Params, options?: any) => {
  return useQuery<Response>({
    queryKey: ["notes", params.workspaceId],
    queryFn: async () => {
      const res =
        await client.api.notes["getNotes"][":workspaceId"]["$get"]({
          param: params,
        });

      return (await res.json()) as Response;
    },
    ...options,
  });
};
