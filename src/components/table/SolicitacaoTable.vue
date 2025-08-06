<template>
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

  <solicitacao-editar-modal :editData="editData"/>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import SolicitacaoEditarModal from "@/components/modal/SolicitacaoEditarModal.vue";

defineProps(['travelRequests'])

const editData = ref<any>({})
const openEditModal = (item: any) => {
  editData.value = {...item}
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}
</script>
