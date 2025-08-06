<template>
  <div class="modal fade"
       id="createModal"
       tabindex="-1"
       aria-labelledby="createModalLabel"
       aria-hidden="true"
       ref="createModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Nova Solicitação</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
</template>

<script setup lang="ts">
import axios from "axios"
import {Modal} from "bootstrap";
import {onMounted, ref} from "vue";
import {toast} from "vue3-toastify";

const emit = defineEmits(['solicitacao-criada']);
const {apiBaseUrl} = defineProps(['apiBaseUrl'])

const form = ref({
  applicant_name: '1',
  destination: '01',
  start_date: '2025-08-08',
  end_date: '2025-08-08',
})

const createModal = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

onMounted(() => {
  const modalEl = document.getElementById('createModal')!
  modalInstance = new Modal(modalEl)
});

const fecharModal = () => {
  modalInstance?.hide();
};

const submitRequest = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${apiBaseUrl}/travel-requests`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 201) {
      toast.success(response.data.message || 'Solicitação criada com sucesso.');

      emit('solicitacao-criada');

      fecharModal();
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Erro ao criar solicitação.');
  }
};
</script>
