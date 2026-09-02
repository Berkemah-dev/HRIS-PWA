import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Array<{ name: string } | string>;
  permissions?: string[];
  effective_permissions?: string[];
  must_change_password?: boolean;
}

export interface CompanyScope {
  id: number | 'all';
  name: string;
  code?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  companies: CompanyScope[];
  selectedCompanyId: number | 'all' | null;
  allowedMenuKeys: string[];
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setCompanyContext: (companies: CompanyScope[], selectedCompanyId?: number | 'all' | null) => void;
  setAllowedMenuKeys: (keys: string[]) => void;
  hasPermission: (permissions: string | string[]) => boolean;
  logout: () => void;
}

const userPermissions = (user: User | null) => {
  if (!user) return [];
  return user.effective_permissions ?? user.permissions ?? [];
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      companies: [],
      selectedCompanyId: null,
      allowedMenuKeys: [],
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setCompanyContext: (companies, selectedCompanyId) => {
        const current = get().selectedCompanyId;
        const next = selectedCompanyId ?? current ?? companies[0]?.id ?? null;
        set({ companies, selectedCompanyId: next });
      },
      setAllowedMenuKeys: (keys) => set({ allowedMenuKeys: keys }),
      hasPermission: (permissions) => {
        const required = Array.isArray(permissions) ? permissions : [permissions];
        const user = get().user;
        const roleNames = (user?.roles ?? []).map((role) => typeof role === 'string' ? role : role.name);
        if (roleNames.includes('super_admin')) return true;
        const available = userPermissions(user);
        return required.some((permission) => available.includes(permission));
      },
      logout: () => set({ token: null, user: null, companies: [], selectedCompanyId: null, allowedMenuKeys: [] }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
