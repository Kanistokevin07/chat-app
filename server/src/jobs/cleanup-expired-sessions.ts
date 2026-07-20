import cron from "node-cron";
import { prisma } from "@/lib/prisma.js";

export function startSessionCleanupJob(){

    cron.schedule("* * * * *", async()=>{
            try{
                const result =
                    await prisma.refreshToken.deleteMany({
                        where:{
                            expiresAt:{
                                lt:new Date()
                            }
                        }
                    });

                console.log(
                    `Deleted ${result.count} expired refresh tokens`
                );

            }catch(error){
                console.error(
                    "Session cleanup failed",
                    error
                );
            }
        }
    );
}