# 💳 Digital Bank MVP

# Sicoob Digital (Simulação de Banco em React), com foco em simular um ambiente real de aplicação, indo além da interface e trabalhando lógica de negócio, integração com API e experiência do usuário.

---

## 🚀 Tecnologias utilizadas

- React (Vite)
- Axios
- JSON Server (API fake)
- Context API
- LocalStorage

---

## 💻 Funcionalidades

- 🔐 Login com validação de usuário
- 🔄 Persistência de sessão (não perde login ao atualizar)
- 💰 Visualização de saldo
- 👁️ Ocultar/mostrar saldo (privacidade)
- 💸 Transferência (Pix simulado)
- 📊 Validação de saldo antes de transferências
- ⚠️ Tratamento de erros (API e login)
- ⏳ Loading e Skeleton para melhor experiência

---

## 🧠 Regras de negócio implementadas

- Não permite transferências com valor zero ou negativo
- Bloqueia transferências com saldo insuficiente
- Atualiza saldo após transação
- Evita quebra da aplicação em caso de falha da API

---

## 🔗 Integração com API

Os dados são consumidos através de uma API simulada com JSON Server, utilizando Axios para requisições HTTP (GET, POST, PUT, DELETE), simulando um ambiente real de backend.

---
## 🔐 Autenticação

- Gerenciada com Context API  
- Persistência com LocalStorage  
- Proteção de rotas com React Router  

---
## 📌 Objetivo do projeto

Simular um sistema bancário funcional, aplicando conceitos utilizados no mercado como:
- consumo de API
- gerenciamento de estado global
- regras de negócio
- tratamento de erros
- foco em experiência do usuário

---
## 📸 Preview

![Preview do projeto](./preview.png) (./preview.png2)

