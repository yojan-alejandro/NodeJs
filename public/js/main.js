import { formatDate } from './utils.js'; 

const denunciasTableBody = document.getElementById('denunciasTableBody'); 
const solicitudesTableBody = document.getElementById('solicitudesTableBody');
const reloadBtn = document.getElementById('reloadBtn');       
const statusMessage = document.getElementById('statusMessage'); 

const showMessage = (message, type) => {
    let bgColor, textColor; 
    switch (type) {
        case 'success':
            bgColor = 'bg-green-100'; 
            textColor = 'text-green-800';
            break;
        case 'error':
            bgColor = 'bg-red-100';     
            textColor = 'text-red-800'; 
            break;
        case 'info':
        default:
            bgColor = 'bg-blue-100';    
            textColor = 'text-blue-800';
            break;
    }
    statusMessage.innerHTML = `
        <div class="p-2 rounded-md ${bgColor} ${textColor} text-center">
            ${message}
        </div>
    `;
};
const showLoadingForTable = (tableBodyElement, colspan, message) => {
    tableBodyElement.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                <div class="flex items-center justify-center">
                    <!-- Icono de spinner SVG animado -->
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ${message}
                </div>
            </td>
        </tr>
    `;
};

const loadDenuncias = async () => {
    showLoadingForTable(denunciasTableBody, 6, 'Cargando denuncias...'); 

    try {
        const response = await fetch('/api/denuncias');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Error en los datos de denuncias recibidos');
        }

        if (!result.data || result.data.length === 0) {
            denunciasTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">No hay denuncias disponibles</td>
                </tr>
            `;
            return;
        }

        denunciasTableBody.innerHTML = result.data.map(denuncia => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${denuncia.id_denuncias}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${denuncia.tipo_delito || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${denuncia.descripcion || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${denuncia.ubicacion || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${denuncia.fecha_hora ? formatDate(denuncia.fecha_hora) : 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${denuncia.estado || 'N/A'}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al cargar denuncias:', error);
        denunciasTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-red-500">Error al cargar denuncias</td>
            </tr>
        `;
    }
};

const loadSolicitudes = async () => {
    showLoadingForTable(solicitudesTableBody, 6, 'Cargando solicitudes...'); 

    try {
        const response = await fetch('/api/solicitudes');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Error en los datos de solicitudes recibidos');
        }

        if (!result.data || result.data.length === 0) {
            solicitudesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">No hay solicitudes disponibles</td>
                </tr>
            `;
            return;
        }

        solicitudesTableBody.innerHTML = result.data.map(solicitud => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${solicitud.id_solicitudes}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${solicitud.tipo_solicitudes || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${solicitud.descripcion || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${solicitud.fecha_solicitudes ? formatDate(solicitud.fecha_solicitudes) : 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${solicitud.estado || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${solicitud.fecha_resolucion ? formatDate(solicitud.fecha_resolucion) : 'N/A'}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        solicitudesTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-red-500">Error al cargar solicitudes</td>
            </tr>
        `;
    }
};

const loadAllData = async () => {
    showMessage('Cargando todos los datos...', 'info');
    await Promise.all([
        loadDenuncias(),
        loadSolicitudes()
    ]);
    showMessage(`Datos actualizados (${new Date().toLocaleTimeString()})`, 'success');
};

reloadBtn.addEventListener('click', loadAllData);
document.addEventListener('DOMContentLoaded', loadAllData);
