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

          <a href="#" class="button" @click="showModal = true">
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
  </main>

  <!-- Modal de Edição -->
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel"
       aria-hidden="true" ref="editModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="submitEdit">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar Solicitação</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="applicant_name" class="form-label">Nome</label>
              <input type="text" id="applicant_name" v-model="editData.applicant_name"
                     class="form-control" required/>
            </div>
            <div class="mb-3">
              <label for="destination" class="form-label">Destino</label>
              <input type="text" id="destination" v-model="editData.destination"
                     class="form-control" required/>
            </div>
            <div class="mb-3">
              <label for="start_date" class="form-label">Data Início</label>
              <input type="date" id="start_date" v-model="editData.start_date" class="form-control"
                     required/>
            </div>
            <div class="mb-3">
              <label for="end_date" class="form-label">Data Fim</label>
              <input type="date" id="end_date" v-model="editData.end_date" class="form-control"
                     required/>
            </div>

            <!--            Somente admin pode alterar o status-->
            <!--            <div class="mb-3">-->
            <!--              <label for="status" class="form-label">Status</label>-->
            <!--              <select id="status" v-model="editData.status" class="form-select" required>-->
            <!--                <option value="solicitado">Solicitado</option>-->
            <!--                <option value="aprovado">Aprovado</option>-->
            <!--                <option value="cancelado">Cancelado</option>-->
            <!--              </select>-->
            <!--            </div>-->

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" :class="{ show: showModal }" style="display: block;" tabindex="-1"
       v-if="showModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Nova Solicitação</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <form @submit.prevent="submitRequest">
          <div class="modal-body">
            <div class="mb-3">
              <label for="applicant_name" class="form-label">Nome do Solicitante</label>
              <input v-model="form.applicant_name" type="text" class="form-control" required/>
            </div>

            <div class="mb-3">
              <label for="destination" class="form-label">Destino</label>
              <input v-model="form.destination" type="text" class="form-control" required/>
            </div>

            <div class="mb-3">
              <label for="start_date" class="form-label">Data de Início</label>
              <input v-model="form.start_date" type="date" class="form-control" required/>
            </div>

            <div class="mb-3">
              <label for="end_date" class="form-label">Data de Término</label>
              <input v-model="form.end_date" type="date" class="form-control" required/>
            </div>

            <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import {ref, onMounted, watch} from 'vue'

import {Modal} from 'bootstrap'
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


const showModal = ref(false)
const formError = ref('')
const form = ref({
  applicant_name: '',
  destination: '',
  start_date: '',
  end_date: '',
  status: ''
})

const closeModal = () => {
  showModal.value = false
  formError.value = ''
  form.value = {
    applicant_name: '',
    destination: '',
    start_date: '',
    end_date: '',
    status: ''
  }
}

const submitRequest = async () => {
  try {
    const token = localStorage.getItem('access_token')

    const response = await axios.post('http://localhost:8000/api/travel-requests', form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response?.status === 201) {
      await fetchTravelRequests()
      closeModal()
    }
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Erro ao criar solicitação.'
  }
}

const editData = ref<any>({})
let editModalInstance: Modal

const openEditModal = (item: any) => {
  editData.value = {...item}
  const modalEl = document.getElementById('editModal')!
  editModalInstance = new Modal(modalEl)
  editModalInstance.show()
}

const submitEdit = async () => {
  try {
    const {status, ...rest} = editData.value
    editData.value = {...rest}

    console.warn(editData.value)

    const token = localStorage.getItem('access_token')
    const response = await axios.put(
      `http://localhost:8000/api/travel-requests/${editData.value.id}`,
      editData.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response?.status === 200) {
      await fetchTravelRequests()
      alert(response?.data?.message)
      editModalInstance.hide()
    }
  } catch (error) {
    console.error('Erro ao atualizar:', error)
    alert('Erro ao atualizar solicitação.')
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
</style>
