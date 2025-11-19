"use client";
import client from "@/lib/hono/rpc";
import { InferResponseType,InferRequestType } from "hono";
import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.auth.register.$post>;
type RequestType = InferRequestType<typeof client.api.auth.register.$post>;

export const useRegister = ()=>{
    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn :async ({json})=>{
            const response=await client.api.auth.register.$post({json:json});
            return await response.json();
        }
    })
    return mutation;
};