import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL as string,
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstname: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      lastname: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      roles: {
        type: "string[]",
        required: true,
        defaultValue: ["ROLE_USER"],
      },
    },
  },
});
