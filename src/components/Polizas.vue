<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary" prominent>
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Pólizas</v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- Nuevo botón para crear póliza -->
                <v-btn color="success" @click="nuevaPoliza">
                    <v-icon left>mdi-plus</v-icon> Nueva Póliza
                </v-btn>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
                <v-list>
                    <v-list-item v-for="(item, index) in items" :key="index" link @click="navigateTo(item.route)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main style="height: 95vh;">
                <v-card>
                    <v-card-title class="text-h6">Lista de Pólizas</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="polizas" item-key="id">
                            <template v-slot:item.cliente="{ item }">
                                {{ item.cliente ? item.cliente.name : 'Sin Cliente' }}
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
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
import axios from '../config/axios';

export default {
    data() {
        return {
            polizas: [],
            headers: [
                { title: 'Total Horas', value: 'total_horas' },
                { title: 'Fecha Inicio', value: 'fecha_inicio' },
                { title: 'Fecha Fin', value: 'fecha_fin' },
                { title: 'Precio', value: 'precio' },
                { title: 'Cliente', value: 'cliente' }, // Se cambió para mostrar el nombre del cliente
                { title: 'Acciones', value: 'actions', sortable: false }
            ],
            drawer: false,
            items: [
                { title: 'Clientes', route: '/home' },
                { title: 'Pólizas', route: '/polizas' }
            ],
            valid: false
        };
    },
    mounted() {
        this.getPolizas();
    },
    methods: {
        getPolizas() {
            axios.get('polizas')
                .then(response => {
                    console.log('Datos de pólizas:', response.data); // Debugging
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
        }
    }
};
</script>
