# Emerson Barber Shop - PEX 2

## 1. Visao Geral do Projeto
Este repositório contem a implementacao pratica da PEX 2, com foco no **frontend** de um sistema web de agendamento para barbearia.

O projeto simula a rotina de atendimento da Emerson Barber Shop, permitindo:
- visualizacao de servicos;
- selecao de barbeiro;
- escolha de data e horario;
- confirmacao de agendamento;
- visao administrativa da agenda.

Nesta etapa, o sistema utiliza **dados mockados** (sem API e sem banco de dados real), conforme o escopo da PEX 2.

## 2. Contexto da PEX 2
A PEX 2 representa a continuidade da etapa de analise e planejamento (PEX 1), agora convertendo os requisitos em uma interface funcional.

### Problema tratado
O processo manual de agendamento (mensagens e anotacoes informais) gera:
- risco de conflito de horarios;
- dificuldade para visualizar agenda disponivel;
- baixa padronizacao do atendimento;
- perda de eficiencia operacional.

### Proposta da PEX 2
Construir um frontend navegavel, com experiencia de uso clara para cliente e para gestao interna, validando o fluxo de agendamento de ponta a ponta com mocks.

## 3. Objetivos desta Entrega
- Implementar uma interface web moderna para a barbearia.
- Simular o fluxo completo de agendamento no frontend.
- Estruturar area administrativa para leitura da operacao.
- Validar regras de ocupacao de horarios com dados mockados.
- Preparar base visual e arquitetural para futura integracao com backend.

## 4. Escopo da Versao Atual
### Incluido
- Home com identidade visual da barbearia (preto e amarelo).
- Pagina de agendamento em 4 etapas.
- Painel administrativo com metricas e filtros.
- Dados mockados de servicos, barbeiros e agendamentos.
- Bloqueio de horarios ocupados para o mesmo barbeiro e data.

### Nao incluido (futuras etapas)
- Persistencia real em banco de dados.
- Login com autenticacao real.
- Integracao com API Node/Express.
- Notificacoes automaticas (WhatsApp, e-mail).
- Regras avancadas de permissao por perfil.

## 5. Tecnologias Utilizadas
- **React 19**
- **Vite 8**
- **React Router DOM**
- **Tailwind CSS 4** (via `@import "tailwindcss"`)
- **React Icons**
- **PostCSS**

## 6. Estrutura de Pastas
```text
my-app/
  public/
  src/
    components/
      SiteShell.jsx
    data/
      mockData.js
    pages/
      HomePage.jsx
      BookingPage.jsx
      AdminPage.jsx
    App.jsx
    main.jsx
    index.css
  index.html
  postcss.config.mjs
  package.json
```

## 7. Descricao Funcional das Telas
### 7.1 Home (`/`)
- apresenta proposta de valor da plataforma;
- exibe servicos com preco e duracao;
- mostra profissionais da barbearia;
- encaminha para agendamento e painel.

### 7.2 Agendamento (`/agendar`)
Fluxo em 4 etapas:
1. escolha do servico;
2. escolha do barbeiro;
3. escolha de data e horario;
4. confirmacao com dados do cliente.

Regras de simulacao:
- horarios ja ocupados ficam indisponiveis;
- agendamento confirmado entra imediatamente na lista em memoria (estado React);
- resumo final apresenta os dados consolidados.

### 7.3 Painel (`/painel`)
- cards com indicadores de operacao;
- filtros por status (todos, confirmado, pendente, concluido, cancelado);
- listagem de agendamentos;
- leitura de demanda por servico;
- carga de atendimento por barbeiro.

## 8. Dados Mockados
Os dados estao centralizados em `src/data/mockData.js`:
- `services`: catalogo de servicos (ticket, duracao, descricao);
- `barbers`: equipe e especialidades;
- `appointments`: agenda simulada;
- `timeSlots`: horarios disponiveis;
- funcoes auxiliares para formatacao (`formatCurrency`, `formatLongDate`).

## 9. Identidade Visual
Direcao visual aplicada:
- paleta principal: preto + amarelo;
- alto contraste para leitura;
- elementos com bordas e gradientes para reforcar linguagem de barbearia;
- layout responsivo para desktop e mobile.

## 10. Como Executar Localmente
### Pre-requisitos
- Node.js 18+ (recomendado 20+)
- npm

### Passos
1. abra o terminal na pasta do projeto:
   ```bash
   cd my-app
   ```
2. instale as dependencias:
   ```bash
   npm install
   ```
3. execute em modo desenvolvimento:
   ```bash
   npm run dev
   ```
4. acesse a URL exibida no terminal (normalmente `http://localhost:5173`).

## 11. Scripts Disponiveis
- `npm run dev`: inicia servidor de desenvolvimento;
- `npm run build`: gera build de producao;
- `npm run preview`: visualiza build local;
- `npm run lint`: executa verificacao de lint.

## 12. Principais Decisoes Tecnicas
- uso de React Router para separar claramente fluxos de cliente e painel;
- mocks em arquivo dedicado para facilitar futura troca por API real;
- estado local no `App.jsx` para refletir novas reservas sem backend;
- composicao por paginas para manter legibilidade do codigo.

## 13. Riscos e Limitacoes da Versao Mockada
- sem persistencia: recarregar pagina perde dados inseridos;
- sem concorrencia real entre usuarios;
- sem seguranca/autenticacao real;
- valores e metricas dependem de base estatica de teste.

## 14. Possiveis Evolucoes (Pos-PEX 2)
- backend com Node.js + Express;
- banco PostgreSQL para persistencia;
- autenticacao JWT e perfis (cliente, barbeiro, admin);
- confirmacao de agendamento por notificacao;
- painel com filtros por periodo e relatorios.

## 15. Autor
- **Caio Emanuel Amorim Gomes**

## 16. Consideracoes Finais
Este projeto atende ao objetivo da PEX 2 ao transformar requisitos levantados anteriormente em um frontend funcional, navegavel e orientado a fluxo real de barbearia.

Mesmo com dados mockados, a aplicacao valida as decisoes de UX, estrutura de navegacao e logica basica de agenda, criando uma base consistente para a proxima etapa com backend e persistencia real.
