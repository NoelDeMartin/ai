import { defineConfig } from 'vite-plus';

export default defineConfig({
    lint: {
        options: {
            typeAware: true,
            typeCheck: true,
        },
    },
    fmt: {
        semi: true,
        singleQuote: true,
        tabWidth: 4,
        sortImports: true,
    },
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        setupFiles: ['./src/testing/setup.ts'],
    },
});
