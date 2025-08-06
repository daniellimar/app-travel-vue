<template>
  <HeaderComponent/>

  <main class="main">
    <div class="responsive-wrapper">
      <div class="main-header">
        <h1>Solicitações de Viagem</h1>

        <div class="search">
          <input type="text" placeholder="Pesquisar"/>
          <button type="submit">
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
            <a href="#" class="active">Ver todas</a>
            <a href="#">Solicitadas</a>
            <a href="#">Aprovadas</a>
            <a href="#">Canceladas</a>
          </div>
        </div>

        <table class="table table-hover display" id="integration-table">
          <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ação</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Zeplin</td>
            <td>Collaboration between designers and developers.</td>
            <td><a href=" #">Ver integração</a></td>
          </tr>
          <tr>
            <td>Figma</td>
            <td>UI design and prototyping tool.</td>
            <td><a href="#">Ver integração</a></td>
          </tr>
          <tr>
            <td>Slack</td>
            <td>Communication platform for teams.</td>
            <td><a href="#">Ver integração</a></td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>
  </main>
</template>


<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
</script>
