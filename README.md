# Emerson Barber Shop - PEX 3

## 1. Visão Geral do Projeto
Este repositório contém o sistema web de agendamento da Emerson Barber Shop.

- A PEX 1 levantou o processo real da barbearia.
- A PEX 2 entregou o frontend navegável, ainda com dados em memória.
- A PEX 3 substitui essa base mockada por uma API Node.js/Express com persistência em PostgreSQL, ambos no Docker.

O cliente escolhe serviço, barbeiro, data e horário. A API grava a reserva e impede dois atendimentos ativos no mesmo barbeiro, data e hora. O painel lê essa agenda e permite confirmar, concluir ou cancelar.

## 2. Problema tratado
O agendamento manual (mensagem e anotação) gera conflito de horário, pouca visibilidade da agenda e atendimento sem padrão. O sistema guarda a operação em banco para a reserva continuar depois de recarregar a página.

## 3. Escopo desta entrega
### Incluído
- API REST em Express.
- PostgreSQL com catálogo, equipe e agenda.
- Docker Compose para banco e API, em portas fora do padrão.
- Frontend consumindo a API (sem `mockData`).
- Bloqueio de horário ocupado, horário passado e horário fora da escala do barbeiro.
- Atualização de status no painel.

### Fora desta entrega
- Login e perfis (cliente, barbeiro, admin).
- Notificações por WhatsApp ou e-mail.
- Relatórios por período.

## 4. Tecnologias
- React 19, Vite e Tailwind CSS 4 no frontend
- Node.js 22 e Express 4 na API
- PostgreSQL 16
- Docker Compose

## 5. Portas
As portas padrão já estão ocupadas por outros containers nesta máquina. Este projeto usa:

| Serviço | Porta no host | Porta no container |
|---|---|---|
| Frontend (Vite) | 5184 | — |
| API | 4107 | 4107 |
| PostgreSQL | 5437 | 5432 |

Banco e API escutam apenas em `127.0.0.1`.

## 6. Como executar
Pré-requisitos: Node.js 20+, npm e Docker.

```bash
docker compose up --build -d
npm install
npm run dev
```

Abra `http://localhost:5184`.

Credenciais locais do Postgres, usadas só neste Compose:

- usuário: `barber`
- senha: `barber_pex3`
- banco: `emerson_barber`
- URL a partir do host: `postgres://barber:barber_pex3@127.0.0.1:5437/emerson_barber`

O script `server/sql/init.sql` cria as tabelas e a carga inicial na primeira subida do volume. Para recriar do zero:

```bash
docker compose down -v
docker compose up --build -d
```

## 7. API
- `GET /api/health`
- `GET /api/shop`
- `GET /api/services`
- `GET /api/barbers`
- `GET /api/appointments`
- `GET /api/slots?barberId=&date=`
- `GET /api/next-slot`
- `POST /api/appointments`
- `PATCH /api/appointments/:id` com `{ "status": "confirmado" | "pendente" | "concluido" | "cancelado" }`

A grade de horários sai da escala de cada barbeiro, em blocos de 30 minutos, com intervalo das 12h às 13h. Cancelar libera o horário. Um índice único impede duas reservas ativas no mesmo encaixe.

## 8. Estrutura
```text
server/
  sql/init.sql
  src/index.js
  src/db.js
  src/slots.js
src/
  api.js
  pages/
  lib/format.js
docker-compose.yml
```

## 9. Limitações
- O painel não tem autenticação.
- A ocupação é por horário de início, sem calcular sobreposição pela duração do serviço.
- A carga inicial traz a barbearia, o catálogo e a equipe. A agenda começa vazia e só recebe reserva pela API.

## 10. Autor
- **Caio Emanuel Amorim Gomes**
