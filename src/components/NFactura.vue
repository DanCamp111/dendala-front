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
                            <v-card-title> Registro de Factura </v-card-title>
                            <v-card-subtitle> Ingresa los datos de la factura </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.fecha" label="Fecha" required
                                                type="date"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.monto" label="Monto" required
                                                type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="formData.observaciones"
                                                label="Observaciones"></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-select v-model="formData.id_cliente" 
                                                :items="clientes" 
                                                item-value="id"
                                                item-title="name" 
                                                label="Seleccionar Cliente" 
                                                required
                                                @update:modelValue="onClienteChange"></v-select>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-select v-model="formData.id_servicio"
                                                :items="serviciosSinPoliza"
                                                item-value="id"
                                                item-title="descripcion"
                                                label="Seleccionar Servicio"
                                                @update:modelValue="onServicioChange">
                                            </v-select>
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
            { title: 'Polizas', route: '/polizas' },
            { title: 'Facturas', route: '/facturas' },
            { title: 'Servicios', route: '/servicios' },
            { title: 'Técnicos', route: '/tecnicos' }
        ],
        valid: false,
        formData: {
            fecha: '',
            monto: '',
            observaciones: '',
            id_cliente: null,
            id_servicio: null
        },
        clientes: [],
        serviciosSinPoliza: []
    }),

    created() {
        this.loadClientes();
        const id = this.$route.params.id;
        if (id) {
            this.loadFactura(id);
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

        loadServiciosSinPoliza(id_cliente) {
            if (!id_cliente) {
                this.serviciosSinPoliza = [];
                return;
            }

            axios.get(`/servicios-sin-poliza/${id_cliente}`)
                .then(response => {
                    this.serviciosSinPoliza = response.data.map(servicio => ({
                        id: servicio.id,
                        descripcion: `Servicio ${servicio.id} - ${servicio.fecha}`
                    }));
                })
                .catch(error => {
                    console.error('Error al cargar los servicios sin póliza:', error);
                });
        },

        onClienteChange() {
            this.formData.id_servicio = null;
            this.loadServiciosSinPoliza(this.formData.id_cliente);
        },

        onServicioChange() {
            this.formData.monto = parseFloat(this.formData.monto || 0) + 50;
        },

        navigateTo(route) {
            this.$router.push(route);
        },

        save() {
            axios.post('/factura/guardar', this.formData)
                .then(response => {
                    if (this.$refs.form) {
                        this.$refs.form.reset();
                    }
                    this.$router.push('/facturas');
                })
                .catch(error => {
                    console.error('Ocurrió un error: ', error);
                });
        },

        loadFactura(id) {
            axios.get(`/factura/${id}`)
                .then(response => {
                    this.formData = response.data;
                    if (this.formData.fecha) {
                        this.formData.fecha = this.formData.fecha.split(' ')[0];
                    }
                })
                .catch(error => {
                    console.error('Ocurrió un error al cargar la factura: ', error);
                });
        }
    }
}
</script>
