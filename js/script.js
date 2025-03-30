// Função para exibir mensagem ao adicionar produto
const addToCartButtons = document.querySelectorAll('.add-to-cart');

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
function adicionarAoCarrinho(produto) {
    // Verifica se já existe um carrinho no localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.nome === produto.nome);
    
    if (produtoExistente) {
        // Se o produto já estiver no carrinho, aumenta a quantidade
        produtoExistente.quantidade += 1;
    } else {
        // Se não estiver, adiciona o produto ao carrinho com quantidade inicial 1
        carrinho.push({...produto, quantidade: 1});
    }
    
    // Atualiza o localStorage com os novos dados do carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Chame a função showMessage para exibir a mensagem
    showMessage(produto.nome); // Alteração feita aqui
}

// Produtos aqui 
document.addEventListener('DOMContentLoaded', function() {
    const produtos = [ 
        {
                nome: 'Bolsa Artemis',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 200.00,
                imagem: ['bolsas/Bolsa Artemis 1.png', 'bolsas/Bolsa Artemis 2.png']
            },
            {
                nome: 'Bolsa Bali',
                descricao: 'Peça confeccionada em fio de malha com alça e ferragens douradas, versátil e elegante',
                preco: 249.00,
                imagem: ['bolsas/Bolsa Bali 1.png', 'bolsas/Bolsa Bali 2.png']
            },
            {
                nome: 'Bolsa Carmem', 
                descricao: 'Peça confeccionada em fio de malha com 2 alças, uma em couro sintético e ferragens douradas versátil para todas as ocasiões',
                preco: 279.00,
                imagem: ['bolsas/Bolsa Carmem 1.png', 'bolsas/Bolsa Carmem 2.png']
            },
            {
                nome: 'Bolsa e Carteira Barbie',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 249.00,
                imagem: ['bolsas/Bolsa Carteira Barbie 1.png', 'bolsas/Bolsa Carteira Barbie 2.png']
            },
            {
                nome: 'Bolsa Drika',
                descricao: 'Peça confeccionada em fio de malha e base em couro sintético com fecho de níquel',
                preco: 250.00,
                imagem: ['bolsas/Bolsa Drika 1.png', 'bolsas/Bolsa Drika 2.png']
            },
            {
                nome: 'Bolsa Florença',
                descricao: 'Peça confeccionada em fio náutico e ferragens dourada, espaçosa e elegante',
                preco: 219.00,
                imagem: ['bolsas/Bolsa Florença 1.png', 'bolsas/Bolsa Florença 2.png']
            },
            {
                nome: 'Bolsa Flores',
                descricao: 'Peça confeccionada em fio náutico e ferragens em níquel para mulheres ousadas',
                preco: 239.00,
                imagem: ['bolsas/Bolsa Flores 1.png', 'bolsas/Bolsa Flores 2.png']
            },
            {
                nome: 'Bolsa Isis',
                descricao: 'Peça confeccionada em fio de malha com alça em madeira',
                preco: 129.00,
                imagem: ['bolsas/Bolsa Isis 1.png', 'bolsas/Bolsa Isis 2.png']
            },
            {
                nome: 'Bolsa Lola',
                descricao: 'Peça confeccionada em fio de malha, alças de couro sintético e ferragens douradas',
                preco: 269.00,
                imagem: ['bolsas/Bolsa Lola 1.png', 'bolsas/Bolsa Lola 2.png']
            },
            {
                nome: 'Bolsa Lorena',
                descricao: 'Peça confeccionada em fio náutico com alto brilho e fecho dourado',
                preco: 280.00,
                imagem: ['bolsas/Bolsa Lorena 1.png', 'bolsas/Bolsa Lorena 2.png']
            },
            {
                nome: 'Bolsa Magnólia',
                descricao: 'Peça confeccionada em fio de malha com alça versáil em ferragens douradas',
                preco: 319.00,
                imagem: ['bolsas/Bolsa Magnólia 1.png', 'bolsas/Bolsa Magnólia 2.png']
            },
            {
                nome: 'Bolsa Maia',
                descricao: 'Peça confeccionada em fio náutico com duas alças de mão e uma tira color ferragens em níquel para mulheres elegantes e versáteis',
                preco: 329.00,
                imagem: ['bolsas/Bolsa Maia 1.png', 'bolsas/Bolsa Maia 2.png']
            },
            {
                nome: 'Bolsa Margarida',
                descricao: 'Peça confeccionada em fio de malha, com fecho da vovó e ferragens de níquel com três tipos de alça',
                preco: 290.00,
                imagem: ['bolsas/Bolsa Margarida 1.png', 'bolsas/Bolsa Margarida 2.png']
            },
            {
                nome: 'Bolsa Meg',
                descricao: 'Peça confeccionada em fio de malha com alça de mão em couro sintético e ferragens douradas',
                preco: 260.00,
                imagem: ['bolsas/Bolsa Meg 1.png', 'bolsas/Bolsa Meg 2.png']
            },
            {
                nome: 'Bolsa Megan',
                descricao: 'Peça confeccionada em fio de malha com ferragens níquel.',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Megan 1.png', 'bolsas/Bolsa Megan 2.png']
            },
            {
                nome: 'Bolsa Mini linha Encanto',
                descricao: 'Peça confeccionada em fio náutico e ferragens douradas',
                preco: 170.00,
                imagem: ['bolsas/Bolsa Mini Linha Encanto 1.png', 'bolsas/Bolsa Mini Linha Encanto 2.png']
            },
            {
                nome: 'Bolsa Miranda',
                descricao: 'Peça confeccionada em fio em pelos com fecho da vovó e ferragens em níquel para ocasiões especiais',
                preco: 259.00,
                imagem: ['bolsas/Bolsa Miranda 1.png', 'bolsas/Bolsa Miranda 2.png']
            },
            {
                nome: 'Bolsa Olivia',
                descricao: 'Peça confeccionada em fio náutico com alça de madeira e ferragens douradas',
                preco: 200.00,
                imagem: ['bolsas/Bolsa Olivia 1.png', 'bolsas/Bolsa Olivia 2.png']
            },
            {
                nome: 'Bolsa Pamela',
                descricao: 'Peça confeccionada em fio de malha com aba base e alça em couro sintético, com ferragens douradas para todas as ocasiões',
                preco: 229.00,
                imagem: ['bolsas/Bolsa Pamela 1.png', 'bolsas/Bolsa Pamela 2.png']
            },
            {
                nome: 'Bolsa Paris',
                descricao: 'Peça confeccionada em fio náutico e alça de madeira com estilo e ousadia',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Paris 1.png', 'bolsas/Bolsa Paris 2.png']
            },
            {
                nome: 'Bolsa Praia',
                descricao: 'Peça confeccionada em fio náutico.',
                preco: 159.00,
                imagem: ['bolsas/Bolsa Praia 1.png', 'bolsas/Bolsa Praia 2.png']
            },
            {
                nome: 'Carteira Linha Encanto',
                descricao: 'Peça confeccionada em fio náutico com alça de níquel',
                preco: 99.00,
                imagem: ['bolsas/Carteira Linha Encanto.png']
            },
            {
                nome: 'Carteira Luna',
                descricao: 'Peça confeccionada em cordão de algodão e bordado',
                preco: 149.00,
                imagem: ['bolsas/Carteira Luna 1.png', 'bolsas/Carteira Luna 2.png']
            },
            {
                nome: 'Mateira e Porta Vinho',
                descricao: 'Peça confeccionada em fio de malha com aba e alça em couro sintético, com base e divisor em acrilíco',
                preco: 329.00,
                imagem: ['bolsas/Mateira e Porta Vinho 1.png', 'bolsas/Mateira e Porta Vinho 2.png']
            },
            {
                nome: 'Bolsa Riviera',
                descricao: 'Peça confeccionada em fio náutico e ferragens douradas para todas as ocasiões',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Riviera 1.png',' bolsas/Bolsa Riviera 2.png']
            },
            {
                nome: 'Bolsa Melani',
                descricao: 'Peça confeccionada em fio náutico com duas alças e ferragens douradas para mulheres estilosas',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Melani 1.png',' bolsas/Bolsa Melani 2.png']
            },
            {
                nome: 'Bolsa Tiphani',
                descricao: 'Peça confeccionada em fio náutico com fecho da vovó com peróla e ferragens douradas moderna e elegante',
                preco: 299.00,
                imagem: ['bolsas/Bolsa Tiphani 1.png', 'bolsas/Bolsa Tiphani 2.png']
            },
            {
                nome: 'Bolsa Sophie',
                descricao: 'Peça confeccionada em fio de malha de algodão, com alça em resina e ferragens em níquel, cores delicadas e apaixonantes',
                preco: 249.00,
                imagem: ['bolsas/Bolsa Sophie 1.png', 'bolsas/Bolsa Sophie 2.png']
            },
            
            // Adicione mais produtos conforme necessário
        ];

    let carrinho = [];
    const produtoLista = document.querySelector('.produtos-lista');

    produtos.forEach(produto => {
        const produtoItem = document.createElement('div');
        produtoItem.classList.add('produto-item');
        produtoItem.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
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
});

// Obtém o botão
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

