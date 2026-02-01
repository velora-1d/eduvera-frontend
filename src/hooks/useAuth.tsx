"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, type User, type Tenant } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    tenant: Tenant | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    planType: string | null;
    tenantId: string | null;
    subscriptionTier: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const setTokenAndStore = (token: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", token);
        }
    };

    const refresh = async () => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
            if (!token) {
                setIsLoading(false);
                return;
            }

            const response = await authApi.me();
            if (response.user) {
                setUser(response.user);
                if (response.user.tenant) {
                    setTenant(response.user.tenant as Tenant);
                }
            }
        } catch {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", response.access_token);
        }
        await refresh();
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // Continue logout even if API call fails
        }
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
        }
        setUser(null);
        setTenant(null);
        router.push("/login");
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                tenant,
                isAuthenticated: !!user,
                isLoading,
                planType: tenant?.plan_type || null,
                tenantId: tenant?.id || user?.tenant_id || null,
                subscriptionTier: tenant?.subscription_tier || "basic",
                login,
                logout,
                refresh,
                setUser,
                setToken: setTokenAndStore,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/**
 * Hook to check if current plan has access to specified plan types
 */
export function usePlanAccess(requiredPlans: ("sekolah" | "pesantren" | "hybrid")[]) {
    const { planType } = useAuth();
    if (!planType) return false;
    return requiredPlans.includes(planType as "sekolah" | "pesantren" | "hybrid");
}

/**
 * Hook for protected routes - redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = "/login") {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Save current URL to redirect back after login
            if (typeof window !== "undefined") {
                sessionStorage.setItem("redirectAfterLogin", pathname);
            }
            router.push(redirectTo);
        }
    }, [isLoading, isAuthenticated, router, pathname, redirectTo]);

    return { isLoading, isAuthenticated };
}
