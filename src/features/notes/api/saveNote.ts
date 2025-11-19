"use client";
import client from "@/lib/hono/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.notes.saveNote.$post
>;
type Payload = InferRequestType<
  typeof client.api.notes.saveNote.$post
>["json"];

export const useSaveNote = () => {
  return useMutation<Response, Error, { json: Payload }>({
    mutationFn: async ({ json }) => {
      const res = await client.api.notes.saveNote.$post({ json });
      return (await res.json()) as Response;
    },
  });
};
