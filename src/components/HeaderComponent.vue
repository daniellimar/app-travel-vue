<template>
  <header class="header">
    <div class="header-content responsive-wrapper">
      <div class="header-logo">
        <a href="#">
          <div>
            <img src="https://assets.codepen.io/285131/untitled-ui-icon.svg"/>
          </div>
          @Travel
        </a>
      </div>

      <div class="header-navigation">
        <nav class="header-navigation-links">
          <a href="#"> Início </a>
        </nav>

        <div class="header-navigation-actions">
          <a href="#" class="icon-button" title="Sair" @click.prevent="logout">
            <i class="ph-sign-out-bold"></i>
          </a>
          <a href="#" class="avatar">
            <img src="https://assets.codepen.io/285131/hat-man.png" alt=""/>
          </a>
          <span class="user">
            {{ user?.name }}
          </span>
        </div>
      </div>

      <a href="#" class="button" @click.prevent="logout">
        <i class="ph-sign-out-bold"></i>
        <span>Sair</span>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useUserStore} from "@/stores/user.ts";
import {computed, onMounted} from "vue";

const router = useRouter()

const userStore = useUserStore();
const user = computed(() => userStore.user);

function logout() {
  localStorage.removeItem('access_token')

  router.push('/login')
}
</script>

<style scoped>
.header-navigation-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.icon-button {
  color: #555;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.icon-button:hover {
  color: #d9534f;
}

.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d6efd;
  transition: border-color 0.3s ease;
}

.avatar img:hover {
  border-color: #0056b3;
}

.user {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  user-select: none;
}
</style>
