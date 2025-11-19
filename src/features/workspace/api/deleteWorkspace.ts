"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.workspace[":workspaceId"]["$delete"]
>;
type Params = InferRequestType<
  typeof client.api.workspace[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  return useMutation<Response, Error, Params>({
    mutationFn: async ({ param }) => {
      const res =
        await client.api.workspace[":workspaceId"]["$delete"]({ param });

      return await res.json();
    },
  });
};
