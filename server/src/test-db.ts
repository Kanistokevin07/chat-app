import { prisma } from "./config/db.js";


async function test(){

    const users = await prisma.user.findMany();

    console.log(users);

}


test();