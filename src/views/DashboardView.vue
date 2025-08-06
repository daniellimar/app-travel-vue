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

      <div class="content-header">
        <div class="content-header-intro"></div>

        <div class="content-header-actions">
          <a href="#" class="button">
            <i class="ph-faders-bold"></i>
            <span>Filters</span>
          </a>
          <a href="#" class="button">
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
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in travelRequests" :key="item.id">
            <td>{{ item.applicant_name }}</td>
            <td>{{ item.destination }}</td>
            <td>{{ formatDate(item.start_date) }}</td>
            <td>{{ formatDate(item.end_date) }}</td>
            <td class="text-capitalize">{{ item.status }}</td>
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
  </main>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'

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
  try {
    const token = localStorage.getItem('access_token')
    const params: any = {
      page: currentPage.value,
    }
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const response = await axios.get('http://localhost:8000/api/travel-requests', {
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
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchTravelRequests(page)
  }
}

onMounted(() => {
  fetchTravelRequests()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

watch([selectedStatus, currentPage], () => {
  fetchTravelRequests()
}, {immediate: true})

const setStatus = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1
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
</style>
