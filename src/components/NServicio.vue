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
                            <v-card-title> Registro de Servicio </v-card-title>
                            <v-card-subtitle> Ingresa los datos del servicio </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-row>
                                            <v-col cols="12" md="4">
                                                <v-text-field v-model="formData.fecha" label="Fecha" required
                                                    type="date"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.horas" label="Horas" required
                                                type="number"></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-select v-model="formData.id_cliente" :items="clientes" item-value="id"
                                                item-title="name" label="Seleccionar Cliente" required
                                                @update:modelValue="onClienteChange"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-select v-model="formData.id_tecnico" :items="tecnicos" item-value="id"
                                                item-title="name" label="Seleccionar Técnico" required></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea v-model="formData.observaciones"
                                                label="Observaciones"></v-textarea>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-select v-model="formData.id_poliza" :items="polizas" item-value="id"
                                                item-title="numero" label="Seleccionar Póliza"></v-select>
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
            { title: 'Técnicos', route: '/tecnicos' },
            { title: 'Polizas', route: '/polizas' },
            { title: 'Facturas', route: '/facturas' },
            { title: 'Servicios', route: '/servicios' }
        ],
        valid: false,
        formData: {
            fecha: '',
            horas: '',
            observaciones: '',
            id_cliente: null,
            id_tecnico: null,
            id_poliza: null,
            id_factura: null
        },
        clientes: [],
        tecnicos: [],
        polizas: [],
        facturas: []
    }),

    created() {
        this.loadClientes();
        this.loadTecnicos();
        const id = this.$route.params.id;
        if (id) {
            this.loadServicio(id);
        }
    },

    methods: {
        loadClientes() {
            axios.get('/clientes')
                .then(response => {
                    this.clientes = response.data
                        .filter(cliente => cliente.rol === 'C')
                        .map(cliente => ({
                            id: cliente.id,
                            name: cliente.name
                        }));
                })
                .catch(error => {
                    console.error('Error al cargar los clientes:', error);
                });
        },

        loadTecnicos() {
            axios.get('/tecnicos')
                .then(response => {
                    this.tecnicos = response.data.map(tecnico => ({
                        id: tecnico.id,
                        name: tecnico.name
                    }));
                })
                .catch(error => {
                    console.error('Error al cargar los técnicos:', error);
                });
        },

        loadPolizas(id_cliente) {
            if (!id_cliente) {
                this.polizas = [];
                return;
            }

            axios.get(`/polizas?cliente_id=${id_cliente}`)
                .then(response => {
                    this.polizas = response.data
                        .filter(poliza => poliza.id_cliente === id_cliente) // Filtramos aquí también por seguridad
                        .map(poliza => ({
                            id: poliza.id,
                            numero: `Póliza #${poliza.id}`
                        }));
                })
                .catch(error => {
                    console.error('Error al cargar las pólizas:', error);
                });
        },

        onClienteChange() {
            this.formData.id_poliza = null;
            this.formData.id_factura = null;
            this.loadPolizas(this.formData.id_cliente);
            this.loadFacturas(this.formData.id_cliente);
        },

        navigateTo(route) {
            this.$router.push(route);
        },

        save() {
            if (this.formData.id) {
                axios.put(`/servicio/actualizar/${this.formData.id}`, this.formData)
                    .then(() => {
                        this.$router.push('/servicios');
                    })
                    .catch(error => {
                        console.error('Error al actualizar el servicio:', error);
                    });
            } else {
                axios.post('/servicio/guardar', this.formData)
                    .then(() => {
                        this.$router.push('/servicios');
                    })
                    .catch(error => {
                        console.error('Error al guardar el servicio:', error);
                    });
            }
        },

        loadServicio(id) {
            axios.get(`/servicio/${id}`)
                .then(response => {
                    this.formData = response.data;
                    // Convertir la fecha al formato adecuado para el input de tipo date
                    if (this.formData.fecha) {
                        this.formData.fecha = this.formData.fecha.split(' ')[0]; // Extrae solo la parte "YYYY-MM-DD"
                    }
                    if (this.formData.fecha) {
                        this.formData.fecha = this.formData.fecha.replace(' ', 'T');
                    }
                    this.loadPolizas(this.formData.id_cliente);
                    this.loadFacturas(this.formData.id_cliente);
                })
                .catch(error => {
                    console.error('Error al cargar el servicio:', error);
                });
        }
    }
}
</script>
