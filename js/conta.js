// Formulário de Cadastro
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const vencimentoCartao = document.getElementById('vencimentoCartao').value; // Captura o vencimento do cartão

    const dadosCadastro = {
        nome: nome,
        email: email,
        senha: senha,
        vencimentoCartao: vencimentoCartao // Adiciona o vencimento do cartão
    };

    // Envia os dados para o backend Flask
    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
    })
    .catch(error => {
        console.error('Erro:', error);  // Trata qualquer erro
        alert('Ocorreu um erro ao salvar os dados.');
    });
});

// Formulário Criar Senha
document.getElementById('senhaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const email = document.getElementById('email').value;  // Supondo que o email também seja enviado

    // Verifica se as senhas são iguais
    if (senha === confirmarSenha) {
        const dadosSenha = {
            senha: senha,
            email: email
        };

        // Envia os dados para o backend Flask
        fetch('/alterar_senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosSenha)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
        })
        .catch(error => {
            console.error('Erro:', error);  // Trata qualquer erro
            alert('Ocorreu um erro ao alterar a senha.');
        });
    } else {
        alert('As senhas não coincidem!');
    }
});

// Formulário de Endereço
document.getElementById('enderecoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const cidade = document.getElementById('cidade').value;
    const complemento = document.getElementById('complemento').value;

    const dadosEndereco = {
        cidade: cidade,
        complemento: complemento
    };

    // Envia os dados para o backend Flask
    fetch('/salvar_endereco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosEndereco)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Exibe a resposta do backend (sucesso ou erro)
    })
    .catch(error => {
        console.error('Erro:', error);  // Trata qualquer erro
        alert('Ocorreu um erro ao salvar o endereço.');
    });
});