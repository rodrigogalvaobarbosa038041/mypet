# MyPet - Sistema de Registro de Pet e Tutor

Este projeto é um sistema completo para cadastro e gerenciamento de pets e seus tutores, desenvolvido como uma aplicação web moderna e responsiva. O sistema permite que usuários registrem informações detalhadas sobre pets e seus responsáveis, incluindo dados pessoais, fotos, e gerenciem o relacionamento entre pets e tutores. A aplicação oferece uma interface intuitiva com recursos avançados de busca, paginação e autenticação, garantindo uma experiência de usuário fluida e eficiente.

## 🚀 Funcionalidades

* **Gestão de Pets**: Cadastro, edição, visualização detalhada e exclusão de pets com informações completas (nome, raça, idade, foto).
* **Gestão de Tutores**: Gerenciamento completo de tutores com dados pessoais, contato, endereço e CPF.
* **Relacionamento Pet-Tutor**: Vinculação automática entre pets e seus respectivos tutores.
* **Busca e Filtragem**: Sistema de busca em tempo real para localizar rapidamente pets e tutores.
* **Paginação**: Navegação eficiente através de grandes volumes de dados.
* **Autenticação Segura**: Sistema de login com controle de sessão e proteção de rotas.
* **Interface Responsiva**: Design adaptável para diferentes dispositivos e tamanhos de tela.
* **Upload de Imagens**: Suporte para fotos de pets e tutores com tratamento de fallback.
* **Tratamento de Erros**: Sistema robusto de gerenciamento de erros com feedback ao usuário.

## 🛠️ Tecnologias

### 💻 Frontend

* **React 18 com TypeScript**: Framework moderno para criação de interfaces interativas e dinâmicas, com tipagem estática para maior segurança e produtividade.
* **React Router DOM v6**: Sistema de roteamento declarativo para navegação entre páginas com proteção de rotas.
* **Bootstrap 5 + React Bootstrap**: Framework CSS para estilização responsiva e componentes UI pré-construídos.
* **Axios**: Cliente HTTP para comunicação eficiente com APIs REST.
* **React Toastify**: Sistema de notificações para feedback ao usuário.
* **Date-fns**: Biblioteca para manipulação e formatação de datas.
* **File-saver**: Utilitário para download de arquivos.

### ⚙️ Backend (API Integration)

* **Comunicação RESTful**: Integração completa com API backend através de endpoints padronizados.
* **Autenticação JWT**: Implementação de tokens JSON Web Token para controle de acesso.
* **Tratamento de Status HTTP**: Manipulação adequada de diferentes códigos de resposta (200, 400, 401, 403, 404, 500).

### 🧪 Testes

* **Jest**: Framework de testes JavaScript para execução de testes unitários e de integração.
* **React Testing Library**: Biblioteca para testes de componentes React focada no comportamento do usuário.
* **@testing-library/jest-dom**: Matchers personalizados para testes DOM.

## 🏗️ Arquitetura e Técnicas

### 📦 Componentização e Arquitetura

O projeto segue uma arquitetura modular e escalável com separação clara de responsabilidades:

* **Components**: Componentes reutilizáveis e independentes (Cards, Navigation, Pagination).
* **Pages**: Componentes de página para diferentes funcionalidades (Listagem, Detalhes, Formulários).
* **Providers**: Contextos React para gerenciamento de estado global (API, Autenticação).
* **Hooks**: Hooks personalizados para lógica reutilizável (useListPage para listagens genéricas).
* **Utils**: Funções utilitárias e helpers (errorHandler para tratamento padronizado de erros).
* **Types**: Definições TypeScript centralizadas para toda a aplicação.

### 🔧 Comunicação e Dados

* **API Centralizada**: Configuração unificada do Axios com interceptors para tratamento global de erros.
* **Tipos Centralizados**: Interfaces TypeScript definidas em `src/types/index.ts` para consistência.
* **Estado Global**: Uso de Context API para gerenciamento de autenticação e configurações.
* **Paginação Genérica**: Hook `useListPage` reutilizável para qualquer entidade com paginação.

### 👤 Autenticação e Segurança

* **JWT Token Storage**: Armazenamento seguro de tokens no localStorage.
* **Protected Routes**: Middleware para proteção de rotas baseada em autenticação.
* **Auto-logout**: Logout automático quando o token expira.
* **Session Management**: Gerenciamento completo do ciclo de vida da sessão do usuário.

### ✅ Testes e Qualidade

* **Testes Unitários**: Cobertura para componentes UI, interações e estados.
* **Testes de Integração**: Validação do fluxo completo da aplicação.
* **Tratamento de Erros**: Sistema padronizado com logging em desenvolvimento.
* **Type Safety**: TypeScript rigoroso para evitar erros em tempo de compilação.

## �🚀 Como Executar

### Pré-requisitos

* Node.js 16 ou superior
* npm ou yarn
* API backend configurada e rodando

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar no diretório
cd mypet/frontend

# Instalar dependências
npm install
```

### Configuração de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
REACT_APP_BASE_URL=http://localhost:8080/api
```

### Executar em Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
# Criar build otimizado
npm run build
```

Os arquivos build serão gerados na pasta `build/`.

## 🧪 Como Testar

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch (desenvolvimento)
npm test --watch

# Executar com coverage
npm test --coverage

# Limpar cache do Jest
npm test --clearCache
```

## � Versão

**Versão Atual: v1.0.0**

## ✒️ Autor

* **Desenvolvedor** - *Rodrigo Galvão Barbosa* - [@digaogalvao](https://github.com/digaogalvao)

### Contato

* 📧 Email: digaogalvao@gmail.com
* 📍 Localização: Brasil

## 📄 Licença

Este projeto é opensource.

## 🎁 Expressões de gratidão

* Agradeço à minha família pelo apoio constante 📢
* À comunidade de desenvolvedores React pelo conhecimento compartilhado
