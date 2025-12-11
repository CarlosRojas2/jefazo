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
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner:true
    },
});

// Register service worker for PWA in production
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        try {
            if (import.meta.env.PROD) {
                navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('Service worker registered.', reg))
                    .catch((err) => console.warn('Service worker registration failed:', err));
            }
        } catch (e) {
            console.warn('SW registration error:', e);
        }
    });
}
