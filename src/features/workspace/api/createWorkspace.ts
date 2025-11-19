"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type Response = InferResponseType<
  typeof client.api.workspace["createWorkspace"]["$post"]
>;
type Body = InferRequestType<
  typeof client.api.workspace["createWorkspace"]["$post"]
>;

export const useCreateWorkspace = () => {
  return useMutation<Response, Error, Body>({
    mutationFn: async ({ json }) => {
      const res = await client.api.workspace["createWorkspace"]["$post"]({
        json,
      });
      return await res.json();
    },
  });
};
