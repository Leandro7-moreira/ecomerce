// Código para Slider
document.addEventListener('DOMContentLoaded', function() {
    const radios = document.querySelectorAll('input[name="btn-radio"]'); // Atualize aqui
    let currentIndex = 0;

    function autoSlide() {
        radios[currentIndex].checked = false; // Desmarca o botão atual
        currentIndex = (currentIndex + 1) % radios.length; // Incrementa o índice
        radios[currentIndex].checked = true; // Marca o próximo botão
    }

    setInterval(autoSlide, 5000); // Troca a cada 5 segundos
});
