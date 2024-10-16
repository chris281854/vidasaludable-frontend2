import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ExtendedUser extends User {
  role: string;
  token: string; // Asegúrate de incluir el token aquí si lo necesitas
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "input", placeholder: "Ingrese su usuario" },
        password: { label: "Password", type: "password", placeholder: "Ingrese su contraseña" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              name: credentials?.name,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json();

        if (!res.ok || user.error) {
          throw new Error(user.error || "Error en la autenticación");
        }

        // Asegúrate de retornar el token y otros campos necesarios
        return {
          name: user.name,
          role: user.role,
          token: user.token, // Asumiendo que tu API devuelve este token
        } as ExtendedUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as ExtendedUser).role;
        token.accessToken = (user as ExtendedUser).token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.token = token.accessToken as string; // Pasa el token a la sesión
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
