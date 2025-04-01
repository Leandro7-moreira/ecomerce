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

document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#vencimentoCartao", {
        dateFormat: "m/y", // Formato MM/YY
        altInput: true,
        altFormat: "F Y", // Mostra mês e ano por extenso
        disableMobile: true, // Mantém a experiência personalizada no mobile
        locale: {
            firstDayOfWeek: 1, // Segunda-feira como primeiro dia
            months: {
                shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
            }
        },
        plugins: [
            new monthSelectPlugin({
                shorthand: false, // Exibe meses por extenso
                dateFormat: "m/y",
                altFormat: "F Y"
            })
        ]
    });
});

// Captura e formata os dados no envio do formulário
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const vencimentoCartaoRaw = document.getElementById('vencimentoCartao').value; // Pega MM/YY

    if (!nome || !email || !senha || !vencimentoCartaoRaw) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const dadosCadastro = {
        nome: nome,
        email: email,
        senha: senha,
        vencimentoCartao: vencimentoCartaoRaw
    };

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
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