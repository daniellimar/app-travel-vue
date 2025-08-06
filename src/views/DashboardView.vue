<template>
  <HeaderComponent/>

  <main class="main">
    <div class="responsive-wrapper">
      <div class="main-header">
        <h1>Solicitações de Viagem</h1>

        <div class="search">
          <input
            type="text"
            placeholder="Pesquisar"
            v-model="searchTerm"
          />
          <button type="button" @click="fetchTravelRequests">
            <i class="ph-magnifying-glass-bold"></i>
          </button>
        </div>
      </div>

      <div class="spinner-container" v-if="isLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <div class="content-header">
        <div class="content-header-intro"></div>

        <div class="content-header-actions">
          <a href="#" class="button">
            <i class="ph-faders-bold"></i>
            <span>Filters</span>
          </a>

          <a href="#"
             class="button"
             data-bs-toggle="modal"
             data-bs-target="#createModal">
            <i class="ph-plus-bold"></i>
            <span>Nova solicitação</span>
          </a>

        </div>
      </div>

      <div class="content">
        <div class="content-panel">
          <div class="vertical-tabs">
            <a href="#"
               :class="{ active: selectedStatus === '' }"
               @click.prevent="setStatus('')">Ver todas</a>
            <a href="#"
               :class="{ active: selectedStatus === 'solicitado' }"
               @click.prevent="setStatus('solicitado')">Solicitadas</a>
            <a href="#"
               :class="{ active: selectedStatus === 'aprovado' }"
               @click.prevent="setStatus('aprovado')">Aprovadas</a>
            <a href="#"
               :class="{ active: selectedStatus === 'cancelado' }"
               @click.prevent="setStatus('cancelado')">Canceladas</a>
          </div>
        </div>

        <table class="table table-hover display" id="integration-table">
          <thead>
          <tr>
            <th>Nome</th>
            <th>Destino</th>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in travelRequests" :key="item.id">
            <td>{{ item.applicant_name }}</td>
            <td>{{ item.destination }}</td>
            <td>{{ formatDate(item.start_date) }}</td>
            <td>{{ formatDate(item.end_date) }}</td>
            <td class="text-capitalize">{{ item.status }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="openEditModal(item)">
                Editar
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button
          class="btn btn-outline-primary btn-sm"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Anterior
        </button>

        <span class="mx-2">Página {{ currentPage }} de {{ totalPages }}</span>

        <button
          class="btn btn-outline-primary btn-sm"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Próxima
        </button>
      </div>
    </div>

    <solicitacao-adicionar-modal :apiBaseUrl="apiBaseUrl"/>

    <solicitacao-editar-modal :apiBaseUrl="apiBaseUrl" :editData="editData" />
  </main>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import {ref, onMounted, watch} from 'vue'

import axios from 'axios'
import SolicitacaoAdicionarModal from "@/components/modal/SolicitacaoAdicionarModal.vue";
import SolicitacaoEditarModal from "@/components/modal/SolicitacaoEditarModal.vue";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// ✅ Interceptador global para 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const isLoading = ref(false)
const searchTerm = ref('')

const travelRequests = ref<{
  id: number;
  applicant_name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
}[]>([])

const selectedStatus = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

const fetchTravelRequests = async (page = 1) => {
  isLoading.value = true

  try {
    const token = localStorage.getItem('access_token')
    const params: any = {
      page: currentPage.value,
    }
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const response = await axios.get(`${apiBaseUrl}/travel-requests`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: currentPage.value,
        status: selectedStatus.value,
        search: searchTerm.value || undefined
      }
    });

    travelRequests.value = response.data.data
    totalPages.value = response.data.meta.last_page
  } catch (error) {
    console.error('Erro ao buscar solicitações de viagem:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTravelRequests()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

watch([selectedStatus, currentPage], () => {
  fetchTravelRequests()
}, {immediate: true})

const setStatus = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1
}

const editData = ref<any>({})

const openEditModal = (item: any) => {
  editData.value = {...item}
}
</script>

<style scoped>
.vertical-tabs a {
  cursor: pointer;
  padding: 0.5em 1em;
  display: inline-block;
  text-decoration: none;
  color: #555;
}

.vertical-tabs a.active {
  font-weight: bold;
  border-bottom: 2px solid #4c6ef5;
  color: #4c6ef5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
