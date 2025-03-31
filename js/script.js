// Função para exibir mensagem ao adicionar produto
function showMessage(productName) {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.innerText = `${productName}\n\nFoi adicionado ao seu carrinho com sucesso!`;
    
    // Exibir contêiner de mensagem
    messageContainer.style.display = 'block'; // Exibe o contêiner da mensagem
    
    // Ocultar contêiner após 5 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none'; // Oculta após 5 segundos
    }, 3000); // Ajuste o tempo conforme necessário
}

// Função para adicionar ao carrinho
async function adicionarAoCarrinho(produto) {
    try {
        const response = await fetch('/api/carrinho', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ produtoId: produto.id, quantidade: 1 }),
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar produto ao carrinho');
        }

        // Chame a função showMessage para exibir a mensagem
        showMessage(produto.nome);
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível adicionar o produto ao carrinho.');
    }
}

// Função para carregar produtos do backend
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }

        const produtos = await response.json();
        const produtoLista = document.querySelector('.produtos-lista');

        produtos.forEach(produto => {
            const produtoItem = document.createElement('div');
            produtoItem.classList.add('produto-item');
            produtoItem.innerHTML = `
                <img src="${produto.imagem[0]}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <a href="#" class="btn">Adicionar ao carrinho</a>
            `;

            const addToCartBtn = produtoItem.querySelector('.btn');
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                adicionarAoCarrinho(produto);
            });

            produtoLista.appendChild(produtoItem);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os produtos.');
    }
}

// Inicializa a página ao carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
});

// Função para gerenciar o botão de rolar para o topo
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Adiciona o evento de rolagem
window.onscroll = function() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight; // Altura total rolável
    const scrollPosition = window.scrollY || document.documentElement.scrollTop; // Posição atual da rolagem

    // Aparece o botão quando chega perto do fim da página, ajustando o valor de -200 conforme necessidade
    if (scrollPosition >= scrollableHeight - 750) { 
        scrollToTopBtn.style.display = "block";
        scrollToTopBtn.style.opacity = "1"; // Suavidade ao aparecer
    } else {
        scrollToTopBtn.style.display = "none";
        scrollToTopBtn.style.opacity = "0"; // Suavidade ao desaparecer
    }
};

// Ao clicar no botão, rola suavemente para o topo
scrollToTopBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

