"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
export const queryClientSingleton = new QueryClient();
export const QueryProvider = ({children}:{children:React.ReactNode})=>{
    
    return(
        <QueryClientProvider client={queryClientSingleton}>
            {children}
        </QueryClientProvider>
    )
}