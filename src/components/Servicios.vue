<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Servicios</v-toolbar-title>
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
                            <v-card-title>Lista de Servicios</v-card-title>
                            <v-card-subtitle>Aquí puedes administrar todos los servicios</v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-btn color="success" class="mb-4" @click="nuevoServicio">
                                <v-icon left>mdi-plus</v-icon> Nuevo Servicio
                            </v-btn>

                            <v-data-table :headers="headers" :items="servicios" item-key="id">
                                <template v-slot:item.cliente="{ item }">
                                    {{ item.cliente ? item.cliente.name : 'Sin Cliente' }}
                                </template>

                                <template v-slot:item.tecnico="{ item }">
                                    {{ item.tecnico ? item.tecnico.name : 'Sin Técnico' }}
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <v-btn icon @click="editServicio(item.id)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red" @click="deleteServicio(item.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
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
    data() {
        return {
            servicios: [],
            headers: [
                { title: 'Fecha', value: 'fecha' },
                { title: 'Horas', value: 'horas' },
                { title: 'Observaciones', value: 'observaciones' },
                { title: 'Cliente', value: 'cliente' },
                { title: 'Técnico', value: 'tecnico' },
                { title: 'Acciones', value: 'actions', sortable: false }
            ],
            drawer: false,
            items: [
                { title: 'Clientes', route: '/clientes' },
                { title: 'Polizas', route: '/polizas' },
                { title: 'Facturas', route: '/facturas' },
                { title: 'Servicios', route: '/servicios' },
                { title: 'Técnicos', route: '/tecnicos' }
            ]
        };
    },
    mounted() {
        this.getServicios();
    },
    methods: {
        getServicios() {
            axios.get('/servicios')
                .then(response => {
                    this.servicios = response.data;
                    console.log('Servicios:', this.servicios);
                })
                .catch(error => {
                    console.error('Error al obtener servicios:', error);
                });
        },
        editServicio(id) {
            this.$router.push(`/servicio/${id}`);
        },
        deleteServicio(id) {
            if (confirm('¿Estás seguro de eliminar este servicio?')) {
                axios.delete(`/servicio/eliminar/${id}`)
                    .then(response => {
                        if (response.data.message === 'Servicio eliminado correctamente') {
                            this.getServicios();
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar servicio:', error);
                    });
            }
        },
        nuevoServicio() {
            this.$router.push('/servicio');
        },
        navigateTo(route) {
            this.$router.push(route);
        }
    }
};
</script>
