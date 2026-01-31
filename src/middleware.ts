export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/multi-level/:path*",
        // Add other protected routes here
    ]
}
