<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Tecnicos</v-toolbar-title>
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
                <v-card class="mx-auto" elevation="16" max-width="1000">
                    <v-card-item>
                        <v-card-title>Lista de Técnicos</v-card-title>
                        <v-card-subtitle>Aquí puedes administrar todos los técnicos</v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <v-btn color="success" class="mb-4" @click="nuevoCliente">
                            <v-icon left>mdi-plus</v-icon> Nuevo Tecnico
                        </v-btn>

                        <v-data-table :headers="headers" :items="clientes" item-key="id">
                            <template v-slot:item.actions="{ item }">
                                <v-btn icon @click="editCliente(item.id)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="red" @click="deleteCliente(item.id)">
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
            clientes: [],
            headers: [
                { title: 'Nombre', value: 'name' },
                { title: 'Correo', value: 'email' },
                { title: 'RFC', value: 'rfc' },
                { title: 'Contacto', value: 'contacto' },
                { title: 'Teléfono', value: 'telefono_contacto' },
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
        this.getClientes();
    },
    methods: {
        getClientes() {
            axios.get('tecnicos')
                .then(response => {
                    this.clientes = response.data;
                })
                .catch(error => {
                    console.error('Error al obtener tecnicos:', error);
                });
        },
        editCliente(id) {
            this.$router.push(`/tecnico/${id}`);
        },
        deleteCliente(id) {
            if (confirm('¿Estás seguro de eliminar este tecnico?')) {
                axios.delete(`tecnico/eliminar/${id}`)
                    .then(response => {
                        if (response.data === 'Ok') {
                            this.getClientes();
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar tecnico:', error);
                    });
            }
        },
        nuevoCliente() {
            this.$router.push('/tecnico');
        },
        navigateTo(route) {
            this.$router.push(route);
        }
    }
};
</script>