<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Facturas</v-toolbar-title>
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
                            <v-card-title>Lista de Facturas</v-card-title>
                            <v-card-subtitle>Aquí puedes administrar todas las facturas</v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-btn color="success" class="mb-4" @click="nuevaFactura">
                                <v-icon left>mdi-plus</v-icon> Nueva Factura
                            </v-btn>

                            <v-data-table :headers="headers" :items="facturas" item-key="id">
                                <template v-slot:item.cliente="{ item }">
                                    {{ item.cliente ? item.cliente.name : 'Sin Cliente' }}
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <v-btn icon @click="editFactura(item.id)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red" @click="deleteFactura(item.id)">
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
            facturas: [],
            headers: [
                { title: 'Fecha', value: 'fecha' },
                { title: 'Monto', value: 'monto' },
                { title: 'Observaciones', value: 'observaciones' },
                { title: 'Cliente', value: 'cliente' },
                { title: 'Acciones', value: 'actions', sortable: false }
            ],
            drawer: false,
            items: [
                { title: 'Clientes', route: '/clientes' },
                { title: 'Polizas', route: '/polizas' },
                { title: 'Facturas', route: '/facturas' }
            ]
        };
    },
    mounted() {
        this.getFacturas();
    },
    methods: {
        getFacturas() {
            axios.get('/facturas')
                .then(response => {
                    this.facturas = response.data;
                })
                .catch(error => {
                    console.error('Error al obtener facturas:', error);
                });
        },
        editFactura(id) {
            this.$router.push(`/factura/${id}`);
        },
        deleteFactura(id) {
            if (confirm('¿Estás seguro de eliminar esta factura?')) {
                axios.delete(`/factura/eliminar/${id}`)
                    .then(response => {
                        if (response.data.message === 'Factura eliminada') {
                            this.getFacturas();
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar factura:', error);
                    });
            }
        },
        nuevaFactura() {
            this.$router.push('/factura');
        },
        navigateTo(route) {
            this.$router.push(route);
        }
    }
};
</script>
