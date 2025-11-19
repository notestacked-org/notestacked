"use client";
import client from "@/lib/hono/rpc";
import { queryClientSingleton } from "@/lib/tanStackQuery/queryProvider";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  typeof client.api.notes.deleteNote.$delete
>;
type Payload = InferRequestType<
  typeof client.api.notes.deleteNote.$delete
>["json"];

export const useDeleteNote = () => {
  return useMutation<Response, Error, { json: Payload }>({
    mutationFn: async ({ json }) => {
      const res = await client.api.notes.deleteNote.$delete({ json });
      return (await res.json()) as Response;
    },
    onSuccess:(_,variables)=>{
        const {workspaceId}=variables.json
        queryClientSingleton.invalidateQueries({queryKey:["notes",workspaceId]});
    }
  });
};
