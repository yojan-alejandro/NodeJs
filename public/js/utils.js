export const formatDate = (dateString) => {

    const options = {
        year: 'numeric',   
        month: 'short',    
        day: 'numeric',    
        hour: '2-digit',   
        minute: '2-digit'  
    };
    try {
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
        console.error("Error al formatear la fecha:", e);
        return 'N/A';
    }
};
