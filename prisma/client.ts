import { PrismaClient } from "@prisma/client";

class prismaSingletonClient{
    private static instance : PrismaClient | undefined;
    private constructor(){}
    public static getInstance():PrismaClient{
        prismaSingletonClient.instance = prismaSingletonClient.instance ?? new PrismaClient();
        return prismaSingletonClient.instance;
    }
}

const prisma = prismaSingletonClient.getInstance();
export default prisma;