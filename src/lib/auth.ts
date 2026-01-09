import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { mongoService } from "@/services/mongoService";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await mongoService.login(credentials.email, credentials.password);
                    if (result.user) {
                        return {
                            id: result.user.id,
                            name: result.user.name,
                            email: result.user.email,
                            role: result.role,
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            // Sync Google user to MongoDB
            if (account?.provider === 'google' && user.email) {
                await connectDB();
                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    // Create new user from Google account
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        password: 'google-oauth', // Placeholder, not used for OAuth
                        role: 'user'
                    });
                }
                // Attach MongoDB ID and role to user object
                (user as any).id = dbUser._id.toString();
                (user as any).role = dbUser.role;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev-environment",
};

