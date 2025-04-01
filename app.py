from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from bcrypt import hashpw, gensalt, checkpw
from database import conectar  # Certifique-se de que você está importando a função correta
from reportlab.pdfgen import canvas  # Importa para geração de PDFs
from email.mime.multipart import MIMEMultipart  # Importa para envio de e-mails
from email.mime.base import MIMEBase  # Importa para anexar arquivos
from email import encoders  # Importa para codificar anexos
import smtplib  # Importa para envio de e-mails

app = Flask(__name__)
CORS(app)  # Habilita o CORS para todas as origens

# Função para conectar ao banco de dados
def conectar_db():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",  # Substitua pelo usuário do MySQL
            password="Leandro#fxx3207",  # Substitua pela senha do MySQL
            database="ecommerce"  # Nome do banco de dados
        )
    except mysql.connector.Error as err:
        raise Exception(f"Erro ao conectar ao banco de dados: {str(err)}")

# Endpoint para obter todos os usuários
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    try:
        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, email FROM usuarios")
        usuarios = cursor.fetchall()
        return jsonify(usuarios), 200
    except Exception as err:
        return jsonify({"error": f"Erro ao buscar usuários: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para adicionar um novo usuário
@app.route('/usuarios', methods=['POST'])
def add_usuario():
    try:
        dados = request.get_json()
        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')

        if not nome or not email or not senha:
            return jsonify({"error": "Todos os campos (nome, email, senha) são obrigatórios!"}), 400

        senha_hashed = hashpw(senha.encode('utf-8'), gensalt()).decode('utf-8')

        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha_hashed))
        conn.commit()

        return jsonify({"message": "Usuário adicionado com sucesso!"}), 201
    except Exception as err:
        return jsonify({"error": f"Erro ao adicionar usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# Endpoint para atualizar um usuário
@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    try:
        dados = request.get_json()
        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')

        # Validações
        if not nome or not email or not senha:
            return jsonify({"error": "Todos os campos (nome, email, senha) são obrigatórios!"}), 400

        # Hash da nova senha
        senha_hashed = hashpw(senha.encode('utf-8'), gensalt()).decode('utf-8')

        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE usuarios
            SET nome = %s, email = %s, senha = %s
            WHERE id = %s
        """, (nome, email, senha_hashed, id))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Usuário não encontrado!"}), 404

        return jsonify({"message": "Usuário atualizado com sucesso!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro ao atualizar usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# Endpoint para excluir um usuário
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        conn = conectar()  # Usando a função importar de database.py
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Usuário não encontrado!"}), 404

        return jsonify({"message": "Usuário excluído com sucesso!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Erro ao excluir usuário: {str(err)}"}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# Endpoint para alterar senha
@app.route('/alterar_senha', methods=['POST'])
def alterar_senha():
    data = request.json
    email = data.get('email')
    nova_senha = data.get('senha')

    if not email or not nova_senha:
        return jsonify({"message": "Email e nova senha são obrigatórios!"}), 400

    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET senha = %s WHERE email = %s", (nova_senha, email))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"message": "Usuário não encontrado!"}), 404

    return jsonify({"message": "Senha alterada com sucesso!"}), 200

# Funcionalidades do carrinho
carrinho = [
    {"nome": "Produto 1", "preco": 100.00, "quantidade": 2, "imagem": "url_da_imagem"},
    {"nome": "Produto 2", "preco": 50.00, "quantidade": 1, "imagem": "url_da_imagem"}
]
endereco_cliente = "Rua Exemplo, 123, Bairro Exemplo, Cidade Exemplo, CEP 12345-678"

@app.route('/api/carrinho', methods=['GET'])
def get_carrinho():
    return jsonify(carrinho), 200

@app.route('/api/carregar-endereco', methods=['GET'])
def carregar_endereco():
    return jsonify({"endereco": endereco_cliente}), 200

@app.route('/api/finalizar-pedido', methods=['POST'])
def finalizar_pedido():
    data = request.json
    print("Pedido recebido:", data)
    return jsonify({"success": True, "message": "Pedido finalizado com sucesso!", "pedidoId": 12345}), 200

@app.route('/processar_pagamento', methods=['POST'])
def processar_pagamento():
    data = request.json
    print("Dados do pagamento:", data)
    return jsonify({"sucesso": True, "message": "Pagamento processado com sucesso!"}), 200

@app.route('/atualizar_confirmacao', methods=['POST'])
def atualizar_confirmacao():
    data = request.json
    print("Confirmação recebida:", data)
    return jsonify({"message": "Confirmação atualizada com sucesso!"}), 200

@app.route('/save_pix_key', methods=['POST'])
def save_pix_key():
    data = request.json
    print("Chave Pix recebida:", data)
    return jsonify({"message": "Chave Pix salva com sucesso!"}), 200

@app.route('/api/upload-nfe', methods=['POST'])
def upload_nfe():
    if 'nfe' not in request.files:
        return jsonify({"error": "Arquivo não enviado."}), 400
    file = request.files['nfe']
    file.save(f"./uploads/{file.filename}")
    return jsonify({"message": "NF-e enviada com sucesso!"}), 200

@app.route('/api/carrinho/total', methods=['GET'])
def get_total():
    total = sum(item['preco'] * item['quantidade'] for item in carrinho)
    return jsonify({'total': total}), 200

@app.route('/api/confirmarPagamento', methods=['POST'])
def confirmar_pagamento():
    data = request.json
    order_id = data.get('order_id')
    email = data.get('email')

    # Simula a confirmação do pagamento
    if not order_id or not email:
        return jsonify({'success': False, 'message': 'Dados inválidos.'}), 400

    # Gera o PDF da NF
    pdf_path = f'nota_fiscal_{order_id}.pdf'
    c = canvas.Canvas(pdf_path)
    c.drawString(100, 750, f"Nota Fiscal - Pedido #{order_id}")
    c.drawString(100, 730, f"Cliente: {email}")
    c.save()

    # Envia o PDF por e-mail
    try:
        enviar_email(email, pdf_path)
        return jsonify({'success': True, 'message': 'NF gerada e enviada com sucesso.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

def enviar_email(destinatario, pdf_path):
    remetente = "suaempresa@exemplo.com"
    senha = "sua_senha"

    msg = MIMEMultipart()
    msg['From'] = remetente
    msg['To'] = destinatario
    msg['Subject'] = "Sua Nota Fiscal"

    # Anexa o PDF
    with open(pdf_path, 'rb') as f:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={pdf_path}')
        msg.attach(part)

    # Envia o e-mail
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(remetente, senha)
        server.send_message(msg)

# Dados simulados para exemplo
pedidos = {
    1: {
        "products": [
            {"name": "Produto 1", "price": 100.00},
            {"name": "Produto 2", "price": 50.00}
        ],
        "orderTotal": 150.00,
        "status": "em_transito"
    }
}

historico_pedidos = {
    1: [
        {"id": 1, "date": "2025-04-01"},
        {"id": 2, "date": "2025-03-30"}
    ]
}

# API para Resumo do Pedido
@app.route('/api/order-summary', methods=['GET'])
def order_summary():
    order_id = request.args.get('order_id', type=int)
    if not order_id or order_id not in pedidos:
        return jsonify({"error": "Pedido não encontrado."}), 404
    return jsonify(pedidos[order_id]), 200

# API para Histórico de Pedidos
@app.route('/api/order-history', methods=['GET'])
def order_history():
    user_id = request.args.get('user_id', type=int)
    if not user_id or user_id not in historico_pedidos:
        return jsonify({"error": "Histórico de pedidos não encontrado."}), 404
    return jsonify({"orders": historico_pedidos[user_id]}), 200

# API para Status do Pedido
@app.route('/api/order-status', methods=['GET'])
def order_status():
    order_id = request.args.get('order_id', type=int)
    if not order_id or order_id not in pedidos:
        return jsonify({"error": "Pedido não encontrado."}), 404
    return jsonify({"status": pedidos[order_id]["status"]}), 200

# API para URL da Nota Fiscal
@app.route('/api/getInvoiceUrl', methods=['GET'])
def get_invoice_url():
    order_id = request.args.get('order_id', type=int)
    if not order_id or order_id not in pedidos:
        return jsonify({"error": "Nota Fiscal não encontrada."}), 404
    pdf_url = f"http://localhost:5000/static/nfe/nota_fiscal_{order_id}.pdf"
    return jsonify({"pdfUrl": pdf_url}), 200

# Dados simulados para exemplo
usuarios = {}

# API para Cadastro de Usuário
@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    number = data.get('number')
    email = data.get('email')
    password = data.get('password')

    if not firstname or not lastname or not number or not email or not password:
        return jsonify({"success": False, "message": "Todos os campos são obrigatórios!"}), 400

    if email in usuarios:
        return jsonify({"success": False, "message": "E-mail já cadastrado!"}), 409

    usuarios[email] = {
        "firstname": firstname,
        "lastname": lastname,
        "number": number,
        "password": password
    }
    return jsonify({"success": True, "message": "Usuário cadastrado com sucesso!"}), 201

# API para Verificar Disponibilidade de E-mail
@app.route('/api/verificar-email', methods=['GET'])
def verificar_email():
    email = request.args.get('email')
    if not email:
        return jsonify({"available": False, "message": "E-mail não informado!"}), 400

    if email in usuarios:
        return jsonify({"available": False, "message": "E-mail já cadastrado!"}), 409

    return jsonify({"available": True, "message": "E-mail disponível para cadastro."}), 200

# API para Login de Usuário (Opcional)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "E-mail e senha são obrigatórios!"}), 400

    if email not in usuarios or usuarios[email]['password'] != password:
        return jsonify({"success": False, "message": "Credenciais inválidas!"}), 401

    return jsonify({"success": True, "message": "Login realizado com sucesso!", "token": "jwt_token_aqui"}), 200

if __name__ == '__main__':
    app.run(debug=True)