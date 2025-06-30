# SHE - Shape Her Era

![Logo do Projeto](./src/assets/images/logo.png)

**SHE - Shape Her Era** é uma plataforma interativa desenvolvida para incentivar a representatividade feminina no setor de tecnologia. O projeto foi desenvolvido como parte da Certificadora 3 e conta com um sistema moderno, acessível e responsivo.

---

## 🚀 Funcionalidades

A aplicação conta com as seguintes funcionalidades:

-  **Autenticação**: páginas de Login e Registro com validação.
-  **Página Home**:
  - Envio de novas ideias através de um formulário com validações.
  - Visualização de ideias aprovadas por categoria.
  - Ranking dos usuários que mais contribuíram.
-  **Painel de Administração**:
  - Aprovação de ideias submetidas.
  - Gestão centralizada de conteúdo.
-  Navegação entre abas (Tabs) com seções dinâmicas.

---

##  Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [React Router](https://reactrouter.com/)
- [Docker](https://www.docker.com/)
- [Beekeeper Studio](https://www.beekeeperstudio.io/)

---

## 📁 Estrutura de Pastas
```
src/
├── assets/ # Imagens e logos
├── pages/
│ ├── Login/ # Tela de login
│ ├── Register/ # Tela de cadastro
│ └── Home/ # Página principal com múltiplos componentes
│ ├── components/
│ └── hooks/
├── routes/ # Rotas da aplicação
├── services/ # Comunicação com API
├── App.tsx
└── main.tsx
```


---

## 🧾 O que você encontrará neste repositório

- Código-fonte completo da aplicação  
- Arquivos de imagem, incluindo a logo oficial do projeto  
- Configurações para execução em ambiente local  
- Dependências gerenciadas via NPM  
- Scripts para desenvolvimento e execução  

---

## 🛠️ Pré-requisitos

Antes de iniciar, você precisa ter os seguintes softwares instalados no seu computador:

### 1. [Git](https://git-scm.com/)
O Git será utilizado para clonar o repositório do projeto. Verifique se está instalado executando no terminal:

```bash
git --version
```

### 2. Faça um git clone do repositório 

```bash
git clone https://github.com/AndreiRezende/certificadora3-SHE.git
```

### 3. Baixe a versão de [Node.js](https://nodejs.org/) (versão 20.15.0)

### 4. Digital o seguinte comando para baixar as depêndencias no terminal

```bash
npm install
```
### 5. Docker
Necessário para levantar o banco de dados local com containers.

Instalação: acesse o site do [Docker](https://www.docker.com)

Baixe e instale o Docker Desktop compatível com seu sistema (Windows, macOS ou Linux).

Após instalar, reinicie o computador e verifique se o Docker está rodando.

```bash
docker --version

```
### 6. [Beekeeper Studio](https://www.beekeeperstudio.io/)
Interface gráfica para acessar e visualizar o banco de dados PostgreSQL.

**Instalação:**
- Acesse: [beekeeperstudio.io](https://www.beekeeperstudio.io/)
- Clique em **Download** e selecione o instalador compatível com seu sistema operacional.
- Instale normalmente e abra o programa.

**Passo a passo para se conectar e visualizar o banco:**

1. Abra o **Beekeeper Studio**.
2. Clique em **"New Connection"** e selecione a opção **PostgreSQL**.
3. Preencha os dados de conexão:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: `postgres`
4. Clique na aba **"Select Database"** e selecione **"Create new"** (ícone de `+`).
5. Digite o nome do novo banco de dados como: certificadora3 
6. Clique em **"Connect"**.
7. Agora, volte ao terminal e execute o seguinte comando para criar as tabelas:

```bash
npx sequelize-cli db:migrate
```

### 7. Para rodar o sistema digite o comando no terminal

```bash 
npm run dev
```

### 8. Logo após isso clica no endereço localhost (ctrl + click) que aparecerá no terminal

---

# Link do video das ferramentas utilizadas para executar o projeto

[![Assista no YouTube](https://img.shields.io/badge/Assistir%20no-Youtube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=5s-8iZBtbUA)
