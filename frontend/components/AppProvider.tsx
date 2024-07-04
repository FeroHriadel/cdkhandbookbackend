'use client'

import { AuthContextProvider } from "@/context/authContext";
import StoreProvider from "@/redux/StoreProvider";
import TagsFetcher from "./TagsFetcher";
import CategoriesFetcher from "./CategoriesFetcher";



export function AppProvider({children}: {children: React.ReactNode}) {   
    return (
        <AuthContextProvider>
            <StoreProvider>
                <TagsFetcher /> {/* load Tags at app start and keep them in redux to avoid having `GET /tags` calls all the time  */}
                <CategoriesFetcher /> {/* load Categories at app start and keep them in redux to avoid having `GET /categories` calls all the time  */}
                {children}
            </StoreProvider>
        </AuthContextProvider>
    )
}