<template>
  <div class="modal fade"
       id="notificationModal"
       tabindex="-1"
       aria-labelledby="notificationModalLabel"
       aria-hidden="true"
       ref="notificationModal">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="notificationModalLabel">Notificações</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Fechar"></button>
        </div>

        <div class="modal-body">
          <div v-if="notifications.length" class="d-flex flex-column gap-3">
            <div v-for="notification in notifications" :key="notification.id"
                 class="card shadow-sm">
              <div class="card-body">
                <p class="card-text mb-2" v-html="notification.data.message"></p>
                <small class="text-muted">{{ formatDate(notification.created_at) }}</small><br/>
                <small class="text-muted">
                  Protocolo:
                  <a href="#"
                     @click.prevent="searchByProtocol(notification.data.travel_request_id)">
                    {{ notification.data.travel_request_id }}
                  </a>
                </small>

                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-primary"
                          @click="markAsRead(notification.id)"
                          :disabled="notification.read_at !== null">
                    {{ notification.read_at === null ? 'Marcar como lida' : 'Lida' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p v-else class="text-center text-muted">Nenhuma notificação.</p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Modal} from 'bootstrap'
import {onMounted, ref, computed} from 'vue'
import {useUserStore} from '@/stores/user.ts'
import axios from 'axios'
import {toast} from 'vue3-toastify'

const notificationModal = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

const userStore = useUserStore()
const notifications = computed(() => userStore.notifications)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

onMounted(() => {
  userStore.fetchNotifications()

  const modalEl = document.getElementById('notificationModal')
  if (modalEl) {
    modalInstance = new Modal(modalEl)
  }
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

async function markAsRead(notificationId: string) {
  try {
    const token = localStorage.getItem('access_token')
    await axios.patch(`${apiBaseUrl}/notifications/${notificationId}/read`, {}, {
      headers: {Authorization: `Bearer ${token}`}
    })

    toast.success('Notificação marcada como lida.')
    await userStore.fetchNotifications()
  } catch (error) {
    toast.error('Erro ao marcar notificação como lida.')
  }
}

const emit = defineEmits(['updateSearchTerm']);

function searchByProtocol(travelRequestId: string) {
  modalInstance?.hide();
  emit('updateSearchTerm', travelRequestId);
}
</script>

<style scoped>
.card {
  border-radius: 8px;
}

.card-body {
  padding: 1rem 1.25rem;
}

.card-text {
  font-size: 1rem;
  color: #333;
}

.text-muted {
  font-size: 0.8rem;
}
</style>
