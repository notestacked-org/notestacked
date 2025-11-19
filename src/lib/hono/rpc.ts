import {hc} from "hono/client"
import { appType } from "@/app/api/[[...route]]/route"


const client = hc<appType>(process.env.NEXT_PUBLIC_URL!,{
    init:{
        credentials:"include"
    }
});


export default client;