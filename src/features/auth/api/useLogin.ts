"use client";
import client from "@/lib/hono/rpc";
import { InferRequestType,InferResponseType } from "hono";
import {useMutation} from "@tanstack/react-query";
type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType= InferRequestType<typeof client.api.auth.login.$post>;
export const useLogin = ()=>{
    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async({json})=>{
            const response = await client.api.auth.login.$post({json:json})
            return await response.json();
        }
    });
    return mutation;
};