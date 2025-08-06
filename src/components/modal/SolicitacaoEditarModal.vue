<template>
  <div class="modal fade"
       id="editModal"
       tabindex="-1"
       aria-labelledby="editModalLabel"
       aria-hidden="true"
       ref="modalRef"
  >
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

            <div class="mb-3" v-if="isAdmin">
              <label for="status" class="form-label">Status</label>
              <select id="status" v-model="editData.status" class="form-select" required>
                <option value="solicitado" disabled>Solicitado</option>
                <option value="aprovado">Aprovado</option>
                <option value="cancelado">Cancelado</option>
              </select>
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
import {computed, onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import axios from 'axios';
import {toast} from 'vue3-toastify';
import {useUserStore} from '@/stores/user';

const props = defineProps(['editData', 'apiBaseUrl']);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const modalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal;

const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);

const emit = defineEmits(['solicitacao-atualizada']);

onMounted(() => {
  userStore.fetchUser();

  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }
});

watch(
  () => props.editData,
  (newVal) => {
    if (newVal?.id && modalInstance) {
      modalInstance.show();
    }
  },
  {deep: true}
);

const fecharModal = () => {
  modalInstance?.hide();
};

const submitEdit = async () => {
  try {
    let data = props.editData;
    const {status, ...rest} = props.editData;

    if (!isAdmin.value || props.editData?.status === 'solicitado') {
      data = {...rest};
    }

    const token = localStorage.getItem('access_token');

    const response = await axios.put(`${apiBaseUrl}/travel-requests/${data?.id}`, data, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (response.status === 200) {
      toast.success(response.data.message || 'Solicitação atualizada com sucesso.');

      emit('solicitacao-atualizada');

      fecharModal();
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? 'Erro ao atualizar solicitação.');
  }
};
</script>
