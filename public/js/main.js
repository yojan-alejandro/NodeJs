import { formatDate, formatPrice } from './utils.js';

const tableBody = document.querySelector('#productsTable tbody');
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

const showLoading = () => {
    showMessage('Cargando datos...', 'info');
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                <div class="flex items-center justify-center">
                    <!-- Icono de spinner SVG animado -->
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                </div>
            </td>
        </tr>
    `;
};

const loadData = async () => {
    showLoading();

    try {
        const response = await fetch('/api/products');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Error en los datos recibidos');
        }

        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">No hay productos disponibles</td>
                </tr>
            `;
            showMessage('No hay productos', 'info');
            return;
        }

        tableBody.innerHTML = result.data.map(product => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.name || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$${formatPrice(product.price)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.stock || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${product.created_at ? formatDate(product.created_at) : 'N/A'}</td>
            </tr>
        `).join('');

        showMessage(`Datos cargados correctamente (${new Date().toLocaleTimeString()})`, 'success');

    } catch (error) {
        console.error('Error al cargar datos:', error);
        showMessage(`Error al cargar datos: ${error.message}`, 'error');
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-center text-red-500">Error al cargar datos</td>
            </tr>
        `;
    }
};

reloadBtn.addEventListener('click', loadData);
document.addEventListener('DOMContentLoaded', loadData);
