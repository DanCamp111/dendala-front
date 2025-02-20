<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Pólizas</v-toolbar-title>
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
                            <v-card-title> Registro de Póliza </v-card-title>
                            <v-card-subtitle> Ingresa los datos de la póliza </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.total_horas" label="Total de horas" required type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.precio" label="Precio" required type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.fecha_inicio" label="Fecha inicio" required type="date"></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.fecha_fin" label="Fecha fin" required type="date"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.observaciones" label="Observaciones" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select
                                                v-model="formData.id_cliente"
                                                :items="clientes"
                                                item-value="id"
                                                item-title="name"
                                                label="Seleccionar Cliente"
                                                required
                                            ></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col>
                                            <v-btn color="primary" @click="save">Guardar</v-btn>
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
import axios from '../config/axios';

export default {
    data: () => ({
        drawer: false,
        items: [
            { title: 'Clientes', route: '/clientes' },
            { title: 'Pólizas', route: '/polizas' },
        ],
        valid: false,
        formData: {
            total_horas: '',
            precio: '',
            fecha_inicio: '',
            fecha_fin: '',
            observaciones: '',
            id_cliente: null
        },
        clientes: [] 
    }),

    created() {
        this.loadClientes(); 
        const id = this.$route.params.id;
        if (id) {
            this.loadPoliza(id);
        }
    },

    methods: {
        loadClientes() {
            axios.get('/clientes')
                .then(response => {
                    console.log("Clientes cargados:", response.data);
                    this.clientes = response.data.map(cliente => ({
                        id: cliente.id,
                        name: cliente.name
                    }));
                })
                .catch(error => {
                    console.error('Error al cargar los clientes:', error);
                });
        },

        navigateTo(route) {
            this.$router.push(route);
        },

        save() {
            axios.post('/poliza/guardar', this.formData)
                .then(response => {
                    if (this.$refs.form) {
                        this.$refs.form.reset();
                    }
                    this.$router.push('/polizas');
                })
                .catch(error => {
                    console.error('Ocurrió un error: ', error);
                });
        },

        loadPoliza(id) {
            axios.get(`/poliza/${id}`)
                .then(response => {
                    this.formData = response.data;
                    this.formData.id_cliente = response.data.id_cliente;
                })
                .catch(error => {
                    console.error('Ocurrió un error al cargar la póliza: ', error);
                });
        }
    }
}
</script>
