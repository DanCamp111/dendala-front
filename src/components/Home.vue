<template>
    <v-card>
        <v-layout>
            <v-app-bar color="primary">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

                <v-toolbar-title>My files</v-toolbar-title>

                <v-spacer></v-spacer>

                <template v-if="$vuetify.display.mdAndUp">
                    <v-btn icon="mdi-magnify" variant="text"></v-btn>

                    <v-btn icon="mdi-filter" variant="text"></v-btn>
                </template>

                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
                <v-list>
                    <v-list-item v-for="(item, items) in items" :key="index" link @click="navigateTo(item.route)">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main style="height: 100vh;">
                <v-card-text>
                    <v-card class="mx-auto" elevation="16" max-width="1000">
                        <v-card-item>
                            <v-card-title>
                                Registro
                            </v-card-title>

                            <v-card-subtitle>
                                Card subtitle secondary text
                            </v-card-subtitle>
                        </v-card-item>

                        <v-card-text>
                            <v-form v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="email" :counter="10" :rules="nameRules" label="Email"
                                                required></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="contraseña" :counter="10" :rules="nameRules"
                                                label="password" required></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="nombre" :rules="emailRules" label="nombre"
                                                required></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="rfc" :rules="emailRules" label="rfc"
                                                required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="contacto" :rules="emailRules" label="contacto"
                                                required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="telefono" :rules="emailRules" label="telefono"
                                                required></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="telefono" :rules="emailRules" label="Direccion"
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
export default {
    data: () => ({
        drawer: false,
        group: null,
        items: [
            {
                title: 'Foo',
                route: '/home',
            },
            {
                title: 'Bar',
                route: '/polizas',
            },
        ],
    }),

    watch: {
        group() {
            this.drawer = false
        },
    },

    methods: {
        navigateTo(route) {
            this.$router.push(route);
        },
        save() {
            console.log('Datos Guardados', this.formData);
        },
    },
}
</script>