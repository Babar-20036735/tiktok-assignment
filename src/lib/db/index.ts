import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";



const sql = neon("postgresql://neondb_owner:npg_AM8igLBR4PzF@ep-cold-rice-a1voy9oy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
export const db = drizzle({ client: sql, schema });

export * from "./schema";