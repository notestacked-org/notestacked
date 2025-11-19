"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type Response = InferResponseType<
  typeof client.api.workspace[":workspaceId"]["$patch"]
>;

type Data = InferRequestType<
  typeof client.api.workspace[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  return useMutation<Response, Error, Data>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.workspace[":workspaceId"]["$patch"]({
        json,
        param,
      });
      return await res.json();
    },
  });
};
