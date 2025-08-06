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
        <nav class="header-navigation-links"></nav>

        <div class="header-navigation-actions">
          <a href="#" class="button">
            <span>Cadastre-se</span>
          </a>
        </div>
      </div>

      <a href="#" class="button">
        <span>Cadastre-se</span>
      </a>
    </div>
  </header>

  <main class="main">
    <div class="responsive-wrapper">
      <div class="content">
        <div class="content-panel">
          <div class="vertical-tabs">
            <a href="#" class="active">Login</a>
          </div>
        </div>

        <div class="content-main">
          <div class="login-container">
            <article class="card login-card">
              <div class="card-header">
                <div class="brand">
                  <img src="https://assets.codepen.io/285131/zeplin.svg" alt="Logo"/>
                  <h3>Acessar</h3>
                </div>
              </div>

              <div class="card-body">
                <form @submit.prevent="handleLogin">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="email" type="email" required/>
                  </div>

                  <div class="form-group">
                    <label for="password">Senha</label>
                    <input id="password" v-model="password" type="password" required/>
                  </div>

                  <button type="submit" class="btn-login">Login</button>

                  <div v-if="error" class="error-message">{{ error }}</div>
                </form>
              </div>
            </article>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: email.value,
      password: password.value,
    })

    const token = response.data.access_token
    localStorage.setItem('access_token', token)

    window.location.href = '/dashboard'
  } catch (err: any) {
    error.value = 'Email ou senha inválidos'
    console.error(err)
  }
}

</script>

<style>
.login-container, .card-body {
  padding: 1em;
}

.login-card {
  width: 100%;
  max-width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand img {
  width: 40px;
  height: 40px;
}

.card-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.form-group input {
  width: 97%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #364fc7;
}

.card-footer {
  padding: 1rem;
  text-align: center;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.card-footer a {
  color: #4c6ef5;
  text-decoration: none;
  font-size: 0.95rem;
}

.card-footer a:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>
