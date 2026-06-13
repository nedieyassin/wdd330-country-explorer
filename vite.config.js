import {defineConfig} from 'vite'
import {resolve} from "path";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],

    root: "src/",
    build: {
        outDir: "../dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                country: resolve(__dirname, "src/country.html"),
            },
        },
    },
})