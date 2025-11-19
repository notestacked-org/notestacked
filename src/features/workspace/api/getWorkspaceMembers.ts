"use client";
import client from "@/lib/hono/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

export type Response = InferResponseType<typeof client.api.workspace[":workspaceId"]["members"]["$get"]>;
type Params = InferRequestType<typeof client.api.workspace[":workspaceId"]["members"]["$get"]>["param"];

export const useWorkspaceMembers = (params: Params,enableCondition:boolean) => {
  return useQuery<Response>({
    queryKey: ["workspaceMembers", params.workspaceId],
    queryFn: async () => {
      const res = await client.api.workspace[":workspaceId"]["members"].$get({ param: params });
      return await res.json() as Response;
    },
    enabled: enableCondition
  });
};
