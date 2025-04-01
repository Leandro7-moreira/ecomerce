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

# Funcionalidades do carrinho
carrinho = []

@app.route('/api/carrinho', methods=['GET'])
def get_carrinho():
    return jsonify(carrinho), 200

@app.route('/api/carrinho', methods=['POST'])
def add_to_carrinho():
    item = request.json
    if not item.get('nome') or not item.get('preco') or not item.get('quantidade'):
        return jsonify({'error': 'Todos os campos (nome, preço, quantidade) são obrigatórios!'}), 400

    carrinho.append(item)
    return jsonify({'message': 'Item adicionado ao carrinho', 'carrinho': carrinho}), 201

@app.route('/api/carrinho/<int:index>', methods=['DELETE'])
def delete_item(index):
    if 0 <= index < len(carrinho):
        removido = carrinho.pop(index)
        return jsonify({'message': 'Item removido', 'item': removido, 'carrinho': carrinho}), 200
    return jsonify({'error': 'Índice inválido'}), 400

@app.route('/api/carrinho/total', methods=['GET'])
def get_total():
    total = sum(item['preco'] * item['quantidade'] for item in carrinho)
    return jsonify({'total': total}), 200

if __name__ == '__main__':
    app.run(debug=True)

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

if __name__ == '__main__':
    app.run(debug=True)