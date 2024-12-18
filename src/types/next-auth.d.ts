import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      token: string;
      role: string;
      icon: Icon;
      email: string;
    };
  }
}
