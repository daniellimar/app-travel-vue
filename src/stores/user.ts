import {defineStore} from 'pinia';
import axios from 'axios';
import {toast} from 'vue3-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAdmin: false,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.user = null;
        this.isAdmin = false;
        return null;
      }

      this.loading = true;
      try {
        const response = await axios.get<User>(`${apiBaseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.user = response.data;
        this.isAdmin = this.user.role === 'admin';

        return this.user;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          toast.error('Erro ao buscar dados do usuário.');
        } else {
          toast.error('Erro inesperado ao buscar dados do usuário.');
        }
        this.user = null;
        this.isAdmin = false;
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
