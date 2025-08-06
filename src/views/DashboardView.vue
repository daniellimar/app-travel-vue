<template>
  <HeaderComponent/>

  <main class="main">
    <div class="responsive-wrapper">
      <div class="main-header">
        <h1>Solicitações de Viagem</h1>

        <div class="search">
          <input
            type="text"
            placeholder="Pesquisar destino, solicitante..."
            v-model="searchTerm"
          />

          <button type="button" @click="fetchTravelRequests">
            <i class="ph-magnifying-glass-bold"></i>
          </button>
        </div>
      </div>

      <hr>

      <div class="filtro">
        <div class="filters-date-range">
          <label>
            De:
            <input
              type="date"
              v-model="dateRange.start"
              @change="handleDateChange"
            />
          </label>

          <label>
            Até:
            <input
              type="date"
              v-model="dateRange.end"
              @change="handleDateChange"
            />
          </label>
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
            <span>Filtros</span>
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

        <solicitacao-table
          :travelRequests="travelRequests"
          @solicitacao-atualizada="handleSolicitacao"/>
      </div>

      <pagination-component
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:currentPage="currentPage = $event"
      />
    </div>

    <solicitacao-adicionar-modal
      :apiBaseUrl="apiBaseUrl"
      @solicitacao-criada="handleSolicitacao"/>
  </main>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import {ref, onMounted, watch} from 'vue'

import axios from 'axios'
import SolicitacaoAdicionarModal from "@/components/modal/SolicitacaoAdicionarModal.vue";
import SolicitacaoTable from "@/components/table/SolicitacaoTable.vue";
import PaginationComponent from "@/components/pagination/PaginationComponent.vue";

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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const isLoading = ref(false)
const searchTerm = ref('')
const dateRange = ref<{ start?: string; end?: string }>({})

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

const fetchTravelRequests = async (): Promise<void> => {
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
        search: searchTerm.value || undefined,
        start_range: dateRange.value.start || undefined,
        end_range: dateRange.value.end || undefined,
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

watch([selectedStatus, currentPage], () => {
  fetchTravelRequests()
}, {immediate: true})

const setStatus = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1
  fetchTravelRequests()
}

const handleSolicitacao = () => {
  fetchTravelRequests()
}

const handleDateChange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    currentPage.value = 1
    fetchTravelRequests()
  }
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

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.filters-date-range {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    font-size: 0.9rem;
    color: #444;

    input[type="date"] {
      margin-top: 0.25rem;
      padding: 0.3rem 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: #4c6ef5;
        outline: none;
        box-shadow: 0 0 3px rgba(76, 110, 245, 0.5);
      }
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;

    label {
      width: 100%;
    }
  }
}

.filtro {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}
</style>
