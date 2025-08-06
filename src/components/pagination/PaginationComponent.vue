<template>
  <div class="pagination">
    <button
      class="btn btn-outline-primary btn-sm"
      :disabled="currentPage === 1"
      @click="previousPage"
    >
      Anterior
    </button>

    <span class="mx-2">Página {{ currentPage }} de {{ totalPages }}</span>

    <button
      class="btn btn-outline-primary btn-sm"
      :disabled="currentPage === totalPages"
      @click="nextPage"
    >
      Próxima
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits(['update:currentPage'])

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>
