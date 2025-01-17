// import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/Theme/theme-provider';
import { Snackbar } from '@/Template/Components/snackbar';
const appName = import.meta.env.VITE_APP_NAME || 'Jefazo';
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <HelmetProvider>
                    {/* <BrowserRouter> */}
                    <Suspense>
                        <ThemeProvider>
                            <Snackbar />
                            <App {...props} />
                        </ThemeProvider>
                    </Suspense>
                    {/* </BrowserRouter> */}
                </HelmetProvider>
            </StrictMode>
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner:true
    },
});
