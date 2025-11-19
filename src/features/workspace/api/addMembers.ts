"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.workspace["addMembers"]["$post"]
>;
type Body = InferRequestType<
  typeof client.api.workspace["addMembers"]["$post"]
>;

export const useAddMembers = () => {
  return useMutation<Response, Error, Body>({
    mutationFn: async ({ json }) => {
      const res = await client.api.workspace["addMembers"]["$post"]({
        json,
      });
      return await res.json();
    },
  });
};
