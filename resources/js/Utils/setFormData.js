/**
 * setFormData - Rellena un formulario de useForm con los datos dados,
 * ignorando claves opcionales.
 *
 * @param {Function} setData - Función de useForm para actualizar campos.
 * @param {Object} form - Objeto base del formulario (estructura original).
 * @param {Object} data - Datos que deseas aplicar al formulario.
 * @param {Array<string>} ignore - Claves que no deben actualizarse.
 */
export function setFormData(setData, form, data, ignore = []) {
    if (!data) return;
    Object.keys(form).forEach(key => {
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            !ignore.includes(key)
        ) {
            setData(key, data[key]);
        }
    });
}
