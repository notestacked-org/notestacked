"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.workspace[":workspaceId"]["members"][":memberEmail"]["role"]["$patch"]
>;

type Params = InferRequestType<
  typeof client.api.workspace[":workspaceId"]["members"][":memberEmail"]["role"]["$patch"]
>;

export const useUpdateMemberRole = () => {
  return useMutation<Response, Error, Params>({
    mutationFn: async ({ param }) => {
      const res =
        await client.api.workspace[":workspaceId"]["members"][":memberEmail"]["role"]["$patch"]({ param });
      return await res.json();
    },
  });
};
