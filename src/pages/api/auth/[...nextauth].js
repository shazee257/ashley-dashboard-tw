import axios from 'axios';
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            authorize: async (credentials) => {
                const { email, password } = credentials;
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/users/login`,
                    { email, password });

                const user = data.user;
                if (user.role === "admin") {
                    console.log("user: ", user);
                    return user;
                }
                return null;
            }
        })
    ],
}

export default NextAuth(authOptions)