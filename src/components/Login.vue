<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../config/axios';
import { AxiosError } from 'axios';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const form = ref(false);
const loading = ref(false);

const router = useRouter();

const required = (value: string) => !!value || 'Campo requerido';

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los datos';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data.acceso === "OK") {
      const token = response.data.token;
      localStorage.setItem('token', token);
      await router.push({ path: '/home' });
    } else {
      errorMessage.value = response.data.error;
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.data) {
        errorMessage.value = err.response.data.message || "Error";
      } else {
        errorMessage.value = 'Error de conexión con el servidor';
      }
    } else {
      errorMessage.value = 'Ocurrió un error inesperado, intenta de nuevo';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-sheet  class="bg-deep-purple pa-12" rounded >
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="login">
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Email"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
          placeholder="Enter your password"
          clearable
          type="password"
        ></v-text-field>

        <!-- Alerta de error -->
        <v-alert v-if="errorMessage" type="error" class="mt-3">
          {{ errorMessage }}
        </v-alert>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>
