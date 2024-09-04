function handleSubmit() {
    const username = document.getElementById('username').value;
    const documentField = document.getElementById('document').value;
    
    
    if (!username) {
        alert("Por favor, ingresa tu nombre.");
        return false; 
    }
    
    
    if (documentField <= 0 || isNaN(documentField)) {
        alert("Por favor, ingresa un número de documento válido (positivo).");
        return false; 
    }
    
    alert(`Bienvenido, ${username}!`);
    window.location.href = "Registrar_Vehiculo.html"; 
    return false; 
}