// resources/js/lib/axios.js
import axios from 'axios'
const api = axios.create({
    baseURL: '/api', // o '' si usas rutas web en Laravel
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, // si usas cookies para auth (Laravel Sanctum)
})

// Interceptar errores globales
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Redirigir al login o mostrar mensaje
            console.warn('No autorizado')
        } else if (error.response?.status === 403) {
            console.warn('Prohibido')
        } else if (error.response?.status === 422) {
            console.warn('Errores de validación')
        } else {
            console.error('Error inesperado', error)
        }
        return Promise.reject(error)
    }
)
export default api
