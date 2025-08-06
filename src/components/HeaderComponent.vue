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

          <a href="#" class="icon-button"
             data-bs-toggle="modal"
             data-bs-target="#notificationModal"
             title="Notificações">
            <i class="ph-bell-bold"></i>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </a>

          <a href="#" class="avatar">
            <img src="https://assets.codepen.io/285131/hat-man.png" alt=""/>
          </a>
          <span class="user">{{ user?.name }}</span>
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
import {useUserStore} from '@/stores/user.ts'
import {computed, onMounted, ref} from 'vue'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const notifications = computed(() => userStore.notifications)

const unreadCount = computed(() =>
  notifications.value.filter(n => n.read_at === null).length
)

function logout() {
  localStorage.removeItem('access_token')
  router.push('/login')
}

onMounted(() => {
  userStore.fetchNotifications()
})
</script>

<style scoped>
.header-navigation-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.icon-button {
  position: relative;
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

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #d9534f;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
  user-select: none;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white;
  border-radius: 6px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.notification-item p {
  margin: 0 0 0.25rem 0;
}

.notification-item small {
  color: #666;
  font-size: 0.75rem;
}
</style>
