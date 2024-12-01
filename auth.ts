import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { saltAndHashPassword } from './lib/helpers';

 
export const { 
  handlers: { GET, POST }, 
  signIn, 
  signOut, 
  auth 
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if(!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password);

        let user: any = await db.user.findUnique({
          where: { email }
        });

        if(!user) {
          user = await db.user.create({
            data: {
              email,
              password: hash
            }
          });
        } else {
          const isMatch = bcrypt.compareSync(credentials.password as string, user.password);
          
          if(!isMatch) {
            throw new Error('Incorrect password');
          }
        }

        return user;
      }
    })
  ],
})