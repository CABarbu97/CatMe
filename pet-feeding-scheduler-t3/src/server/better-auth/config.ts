import { betterAuth } from "better-auth";
import { env } from "~/env";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: `file:${process.cwd()}/prisma/auth.db`,
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000", "http://192.168.0.110:3000"],
});

export type Session = typeof auth.$Infer.Session;
