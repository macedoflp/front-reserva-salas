# Reserva de Salas Frontend

Frontend do sistema Reserva de Salas, construído como um SaaS corporativo moderno para gerenciar salas, reservas, filtros operacionais e indicadores de uso.

## Visão Geral

A aplicação permite:

- visualizar uma dashboard analítica com dados reais da API;
- listar, criar, editar e excluir salas;
- listar, criar, editar e excluir reservas;
- filtrar reservas por sala, status e ordenação;
- receber feedbacks visuais para conflitos de horário e capacidade excedida;
- navegar em layout responsivo com sidebar desktop e menu mobile.

## Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- TailwindCSS
- Lucide Icons

## Arquitetura

```txt
src/
  components/
    dashboard/      # blocos específicos da dashboard
    layout/         # header e sidebar
    ui/             # componentes reutilizáveis
  layouts/          # shell principal da aplicação
  pages/            # rotas visuais
  router/           # Vue Router
  services/         # integração HTTP com backend
  stores/           # estado global, toasts e layout
  types/            # contratos TypeScript
  utils/            # helpers de ambiente, classes e formatação
```

## Backend

O frontend foi preparado para consumir o backend NestJS do projeto Reserva de Salas.

URL local esperada:

```txt
http://localhost:3000/api/v1
```

Endpoints consumidos:

```txt
GET    /rooms
GET    /rooms/:id
POST   /rooms
PATCH  /rooms/:id
DELETE /rooms/:id

GET    /reservations
GET    /reservations/:id
POST   /reservations
PATCH  /reservations/:id
DELETE /reservations/:id
```

Filtros de reservas:

```txt
roomId=<uuid>
status=upcoming|ongoing|finished
order=asc|desc
```

## Setup

Pré-requisitos:

- Node.js 20 ou superior
- npm
- backend rodando localmente

Instale as dependências:

```bash
npm install
```

Configure o ambiente:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Rode em desenvolvimento:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Inicia o servidor local do Vite.

```bash
npm run typecheck
```

Executa a validação TypeScript com `vue-tsc`.

```bash
npm run build
```

Executa typecheck e gera a versão de produção em `dist/`.

```bash
npm run preview
```

Serve localmente o build de produção.

## Funcionalidades

### Dashboard

- total de salas;
- total de reservas;
- reservas em andamento;
- próximas reservas;
- salas mais utilizadas;
- próximas reservas;
- atividade recente;
- atalhos rápidos.

### Salas

- listagem em cards;
- criação;
- edição;
- exclusão com confirmação;
- validação de nome obrigatório;
- validação de capacidade maior que zero;
- loading skeleton;
- estados vazios;
- toasts de sucesso e erro.

### Reservas

- listagem em cards;
- criação;
- edição;
- exclusão com confirmação;
- filtros por sala, status e ordenação;
- validação de sala, título, participantes, início e fim;
- alerta visual para conflito de horário;
- alerta visual para capacidade excedida;
- status visuais: Em andamento, Próxima e Encerrada.

## Design System

Componentes reutilizáveis:

```txt
src/components/ui/Badge.vue
src/components/ui/Button.vue
src/components/ui/Card.vue
src/components/ui/IconButton.vue
src/components/ui/Input.vue
src/components/ui/LoadingCardGrid.vue
src/components/ui/Modal.vue
src/components/ui/Select.vue
src/components/ui/Skeleton.vue
src/components/ui/ToastViewport.vue
```

Direção visual:

- fundo claro;
- tipografia limpa;
- bordas suaves;
- sombras discretas;
- componentes densos o bastante para uso operacional;
- responsividade para desktop e mobile.

## Build

Gere a versão final:

```bash
npm run build
```

Os arquivos serão emitidos em:

```txt
dist/
```

Teste o build:

```bash
npm run preview
```

## Deploy

O projeto pode ser publicado em serviços como Vercel, Netlify, Render ou qualquer hospedagem estática.

Configuração necessária no ambiente de deploy:

```env
VITE_API_URL=https://sua-api.com/api/v1
```

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```

## Checklist de Entrega

- Dashboard integrada com dados reais.
- CRUD de salas integrado.
- CRUD de reservas integrado.
- Filtros de reservas funcionando.
- Tratamento global de erros com Axios.
- Toasts globais.
- Loading skeletons.
- Estados vazios.
- Layout responsivo.
- TypeScript validado no build.

