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
          <a href="#" class="avatar">
            <img src="https://assets.codepen.io/285131/hat-man.png" alt=""/>
          </a>
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

const router = useRouter()

function logout() {
  localStorage.removeItem('access_token')

  router.push('/login')
}

</script>
