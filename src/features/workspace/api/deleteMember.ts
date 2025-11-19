"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

// Response type from /workspace/:workspaceId/members/:memberEmail DELETE
type Response = InferResponseType<
  typeof client.api.workspace[":workspaceId"]["members"][":memberEmail"]["$delete"]
>;

// Only extract the param object
type Params = InferRequestType<
  typeof client.api.workspace[":workspaceId"]["members"][":memberEmail"]["$delete"]
>["param"];

export const useRemoveMember = () => {
  return useMutation<Response, Error, Params>({
    mutationFn: async (param) => {
      const res =
        await client.api.workspace[":workspaceId"]["members"][":memberEmail"][
          "$delete"
        ]({ param });

      return await res.json();
    },
  });
};
