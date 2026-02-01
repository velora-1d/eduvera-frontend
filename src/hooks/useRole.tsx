"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    UserRole,
    SekolahRole,
    PesantrenRole,
    SekolahModule,
    PesantrenModule,
    sekolahRoles,
    pesantrenRoles,
    sekolahPermissions,
    pesantrenPermissions,
    PermissionLevel,
    RoleMetadata
} from '@/lib/roles';

interface RoleContextType {
    role: UserRole | null;
    roleMetadata: RoleMetadata | null;
    setRole: (role: UserRole) => void;
    hasPermission: (module: SekolahModule | PesantrenModule, level: PermissionLevel) => boolean;
    canAccess: (module: SekolahModule | PesantrenModule) => boolean;
    canEdit: (module: SekolahModule | PesantrenModule) => boolean;
    canManage: (module: SekolahModule | PesantrenModule) => boolean;
    isSekolahRole: boolean;
    isPesantrenRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
    children: ReactNode;
    initialRole?: UserRole;
}

export function RoleProvider({ children, initialRole }: RoleProviderProps) {
    const [role, setRoleState] = useState<UserRole | null>(initialRole || null);

    // Load role from localStorage on mount
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole && !role) {
            setRoleState(storedRole as UserRole);
        }
    }, []);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        localStorage.setItem('userRole', newRole);
    };

    const isSekolahRole = role ? Object.keys(sekolahRoles).includes(role) : false;
    const isPesantrenRole = role ? Object.keys(pesantrenRoles).includes(role) : false;

    const roleMetadata = role
        ? isSekolahRole
            ? sekolahRoles[role as SekolahRole]
            : pesantrenRoles[role as PesantrenRole]
        : null;

    const hasPermission = (module: SekolahModule | PesantrenModule, level: PermissionLevel): boolean => {
        if (!role) return false;

        const levelOrder: Record<PermissionLevel, number> = {
            none: 0,
            read: 1,
            write: 2,
            admin: 3
        };

        const permissions = isSekolahRole
            ? sekolahPermissions[role as SekolahRole]
            : pesantrenPermissions[role as PesantrenRole];

        const actualLevel = (permissions as Record<string, PermissionLevel>)[module] || 'none';
        return levelOrder[actualLevel] >= levelOrder[level];
    };

    const canAccess = (module: SekolahModule | PesantrenModule): boolean => {
        return hasPermission(module, 'read');
    };

    const canEdit = (module: SekolahModule | PesantrenModule): boolean => {
        return hasPermission(module, 'write');
    };

    const canManage = (module: SekolahModule | PesantrenModule): boolean => {
        return hasPermission(module, 'admin');
    };

    return (
        <RoleContext.Provider value={{
            role,
            roleMetadata,
            setRole,
            hasPermission,
            canAccess,
            canEdit,
            canManage,
            isSekolahRole,
            isPesantrenRole
        }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}

// Hook for checking specific permissions
export function usePermission(module: SekolahModule | PesantrenModule) {
    const { canAccess, canEdit, canManage, hasPermission } = useRole();

    return {
        canRead: canAccess(module),
        canWrite: canEdit(module),
        canAdmin: canManage(module),
        check: (level: PermissionLevel) => hasPermission(module, level)
    };
}
