import client from "@/lib/hono/rpc";
import { InferResponseType } from "hono";
import {useQuery} from "@tanstack/react-query";
type ResponseType = InferResponseType<typeof client.api.auth.validate.$get>;
export const useValidate = ()=>{
    const query= useQuery<
    ResponseType,
    Error
    >({
        queryKey: ["validate"],
        queryFn: async()=>{
            const response = await client.api.auth.validate.$get();
            return await response.json();
        },
        retry: false,
        refetchOnWindowFocus:false,
    });
    return query;
};