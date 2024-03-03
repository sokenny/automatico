import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn(data:any) {
      const { user, profile } = data;
      const userFromDb = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...user,
            first_name: profile?.given_name,
            last_name: profile?.family_name,
          }),
        }
      );
      const response = await userFromDb.text();
      return true;
    },
  },
  session: {
    jwt: true,
  },
});

export { handler as GET, handler as POST };
