<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Clientes</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" temporary>
                <v-list>
                    <v-list-item v-for="(item, index) in items" :key="index" link @click="navigateTo(item.route)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main style="height: 100vh;">
                <v-card-text>
                    <v-card class="mx-auto" elevation="16" max-width="1000">
                        <v-card-item>
                            <v-card-title> Registro </v-card-title>
                            <v-card-subtitle> Ingresa los datos del cliente </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.email" label="Email"
                                                required></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.password" label="Contraseña" required
                                                type="password"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.name" label="Nombre"
                                                required></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="formData.rfc" label="RFC" required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="formData.contacto" label="Contacto"
                                                required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="formData.telefono_contacto" label="Teléfono"
                                                required></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="formData.direccion" label="Dirección"
                                                required></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-btn color="primary" @click="save">Enviar</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
import axios from '../config/axios'; // Asegúrate de que esta ruta sea correcta

export default {
    data: () => ({
        drawer: false,
        group: null,
        items: [
            { title: 'Clientes', route: '/clientes' },
            { title: 'Polizas', route: '/polizas' },
            { title: 'Facturas', route: '/facturas' },
            { title: 'Servicios', route: '/servicios' },
            { title: 'Técnicos', route: '/tecnicos' }
        ],
        valid: false,
        formData: {
            name: '',
            email: '',
            password: '',
            rfc: '',
            contacto: '',
            telefono_contacto: '',
            direccion: '',
            rol: ''
        }
    }),
    watch: {
        group() {
            this.drawer = false;
        }
    },
    created() {
        const id = this.$route.params.id;
        if (id) {
            this.loadCliente(id);
        }
    },
    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        save() {
            axios.post('/cliente/guardar', this.formData)
                .then(response => {
                    if (this.$refs.form) {
                        this.$refs.form.reset();
                    }
                    this.formData.id = 0;
                    this.$router.push('/clientes');
                })
                .catch(error => {
                    console.error('Ocurrió un error: ', error);
                });
        },
        loadCliente(id) {
            axios.get(`/cliente/${id}`)
                .then(response => {
                    this.formData = { ...response.data, password: '' };
                })
                .catch(error => {
                    console.error('Ocurrió un error: ', error);
                });
        }
    }
}
</script>