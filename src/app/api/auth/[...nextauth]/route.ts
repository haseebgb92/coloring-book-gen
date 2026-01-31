import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    // Fetch user from profiles table
                    const { data: user, error } = await supabaseAdmin
                        .from("profiles")
                        .select("*")
                        .eq("email", credentials.email)
                        .single();

                    if (error || !user) {
                        throw new Error("No user found with this email");
                    }

                    // Check password
                    const isValid = await compare(credentials.password, user.password_hash);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        plan: user.plan,
                    } as any;
                } catch (err: any) {
                    console.error("Auth error:", err.message);
                    throw new Error(err.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            const userId = token.id || token.sub;

            // 1. INITIAL SIGN-IN LOGIC
            if (user) {
                token.role = (user as any).role;
                token.plan = (user as any).plan;
                token.id = user.id;

                // Generate a unique ID for this specific session/device
                const sessionId = Math.random().toString(36).substring(2, 15);
                token.sessionId = sessionId;

                try {
                    // Fetch current sessions
                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('active_sessions')
                        .eq('id', user.id)
                        .single();

                    let sessions = Array.isArray(profile?.active_sessions) ? profile.active_sessions : [];

                    // Add new session to the front
                    sessions.unshift({
                        id: sessionId,
                        createdAt: new Date().toISOString(),
                        userAgent: 'Web Browser' // Simplified for now
                    });

                    // LIMIT TO 3 SESSIONS: Keep only the 3 most recent
                    sessions = sessions.slice(0, 3);

                    // Update DB with the new session list
                    await supabaseAdmin
                        .from('profiles')
                        .update({ active_sessions: sessions })
                        .eq('id', user.id);

                } catch (err) {
                    console.error("Error managing active sessions:", err);
                }
            }

            // 2. REFRESH & SECURITY CHECKS (Runs on every page interaction)
            try {
                const { data: profile } = await supabaseAdmin
                    .from("profiles")
                    .select("role, plan, plan_expires_at, active_sessions")
                    .eq("id", userId)
                    .single();

                if (profile) {
                    let currentPlan = profile.plan;

                    // A. AUTO-EXPIRY LOGIC
                    if (currentPlan === 'pro' && profile.plan_expires_at) {
                        const expiryDate = new Date(profile.plan_expires_at);
                        if (new Date() > expiryDate) {
                            await supabaseAdmin
                                .from('profiles')
                                .update({ plan: 'free', plan_expires_at: null })
                                .eq('id', userId);
                            currentPlan = 'free';
                        }
                    }

                    // B. CONCURRENT SESSION CHECK (Device Limit)
                    const activeSessions = Array.isArray(profile.active_sessions) ? profile.active_sessions : [];
                    const isSessionStillActive = activeSessions.some((s: any) => s.id === token.sessionId);

                    if (!isSessionStillActive && token.sessionId) {
                        // This device was kicked out by a newer login
                        token.sessionError = "KICKED_OUT";
                    }

                    token.role = profile.role;
                    token.plan = currentPlan;
                    token.plan_expires_at = currentPlan === 'pro' ? profile.plan_expires_at : null;
                }
            } catch (err) {
                console.error("Error refreshing token from DB:", err);
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).plan = token.plan;
                (session.user as any).id = token.id || token.sub;
                (session.user as any).plan_expires_at = token.plan_expires_at;
                (session.user as any).sessionError = token.sessionError;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin", // Redirect back to signin on error
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
