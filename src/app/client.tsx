"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";


export const Client = () => {
    const trpc = useTRPC();
    const {data} = useQuery(trpc.createAI.queryOptions({text:"hello world prefetch"}));
return(
    <div>
        {JSON.stringify(data)}
    </div>
)

}