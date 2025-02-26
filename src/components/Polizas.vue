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
                            <v-card-title>Lista de Pólizas</v-card-title>
                            <v-card-subtitle>Aquí puedes administrar todas las pólizas</v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-btn color="success" class="mb-4" @click="nuevaPoliza">
                                <v-icon left>mdi-plus</v-icon> Nueva Póliza
                            </v-btn>

                            <v-data-table :headers="headers" :items="polizas" item-key="id">
                                <template v-slot:item.cliente="{ item }">
                                    {{ item.cliente ? item.cliente.name : 'Sin Cliente' }}
                                </template>

                                <template v-slot:item.fecha_fin="{ item }">
                                    <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                            <v-chip v-bind="props" :color="getExpirationColor(item.fecha_fin)">
                                                {{ item.fecha_fin }}
                                                <v-icon v-if="isNearExpiration(item.fecha_fin)" color="warning">
                                                    mdi-alert
                                                </v-icon>
                                            </v-chip>
                                        </template>
                                        <span>{{ getExpirationMessage(item.fecha_fin) }}</span>
                                    </v-tooltip>
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <v-btn icon @click="editPoliza(item.id)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red" @click="deletePoliza(item.id)">
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
import { format, differenceInDays } from 'date-fns';

export default {
    data() {
        return {
            polizas: [],
            headers: [
                { title: 'Total Horas', value: 'total_horas' },
                { title: 'Fecha Inicio', value: 'fecha_inicio' },
                { title: 'Fecha Fin', value: 'fecha_fin' },
                { title: 'Precio', value: 'precio' },
                { title: 'Cliente', value: 'cliente' },
                { title: 'Acciones', value: 'actions', sortable: false }
            ],
            drawer: false,
            items: [
                { title: 'Clientes', route: '/clientes' },
                { title: 'Pólizas', route: '/polizas' }
            ]
        };
    },
    mounted() {
        this.getPolizas();
    },
    methods: {
        getPolizas() {
            axios.get('polizas')
                .then(response => {
                    this.polizas = response.data;
                })
                .catch(error => {
                    console.error('Error al obtener pólizas:', error);
                });
        },
        editPoliza(id) {
            this.$router.push(`/poliza/${id}`);
        },
        deletePoliza(id) {
            if (confirm('¿Estás seguro de eliminar esta póliza?')) {
                axios.delete(`poliza/eliminar/${id}`)
                    .then(response => {
                        if (response.data.message === 'Eliminado correctamente') {
                            this.getPolizas();
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar póliza:', error);
                    });
            }
        },
        nuevaPoliza() {
            this.$router.push('/poliza');
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        isNearExpiration(fechaFin) {
            const today = new Date();
            const expirationDate = new Date(fechaFin);
            return differenceInDays(expirationDate, today) <= 7;
        },
        getExpirationColor(fechaFin) {
            const today = new Date();
            const expirationDate = new Date(fechaFin);
            if (expirationDate < today) {
                return "red"; // Vencido
            }
            return this.isNearExpiration(fechaFin) ? "warning" : "default";
        },
        getExpirationMessage(fechaFin) {
            const today = new Date();
            const expirationDate = new Date(fechaFin);
            if (expirationDate < today) {
                return "Esta póliza está vencida.";
            }
            if (this.isNearExpiration(fechaFin)) {
                return "Esta póliza está próxima a vencer.";
            }
            return "Esta póliza está vigente.";
        }
    }
};
</script>
