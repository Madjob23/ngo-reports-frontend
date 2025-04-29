// src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
          });
          
          const { token, user } = response.data;
          
          // Set the auth state in Zustand store
          set({ token, user, isLoading: false });
          
          // Also set a specific cookie for middleware to check
          // This ensures server-side middleware can validate authentication
          document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Strict`; // 30 days
          
          console.log("Auth state after login:", { token: !!token, user });
          console.log("Auth cookie set:", document.cookie.includes('auth-token'));
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'An error occurred during login' 
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'An error occurred during login' 
          };
        }
      },
      
      logout: () => {
        // Clear the auth state in Zustand store
        set({ token: null, user: null });
        
        // Also clear the auth cookie for middleware
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        console.log("User logged out, auth state cleared");
      },
      
      getAuthHeaders: () => {
        const state = useAuthStore.getState();
        return state.token ? { Authorization: `Bearer ${state.token}` } : {};
      },
      
      isAuthenticated: () => {
        const state = useAuthStore.getState();
        return !!state.token;
      },
      
      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.role === 'admin';
      },
      
      isNGO: () => {
        const state = useAuthStore.getState();
        return state.user?.role === 'ngo';
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Explicitly use localStorage
      partialize: (state) => ({ 
        token: state.token,
        user: state.user
      }), // Only persist these fields
    }
  )
);

export default useAuthStore;