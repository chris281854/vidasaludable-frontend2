import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id:number
      name: string;
      token: string;
      role: string;
      icon: Icon;
      email: string;
    };
  }
}
