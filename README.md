# Emerson Barber Shop - PEX 2

## 1. Visão Geral do Projeto
Este repositório contém a implementação prática da PEX 2, com foco no **frontend** de um sistema web de agendamento para barbearia.

O projeto simula a rotina de atendimento da Emerson Barber Shop, permitindo:
- visualização de serviços;
- seleção de barbeiro;
- escolha de data e horário;
- confirmação de agendamento;
- visão administrativa da agenda.

Nesta etapa, o sistema utiliza **dados mockados** (sem API e sem banco de dados real), conforme o escopo da PEX 2.

## 2. Contexto da PEX 2
A PEX 2 representa a continuidade da etapa de análise e planejamento (PEX 1), agora convertendo os requisitos em uma interface funcional.

### Problema tratado
O processo manual de agendamento (mensagens e anotações informais) gera:
- risco de conflito de horários;
- dificuldade para visualizar agenda disponível;
- baixa padronização do atendimento;
- perda de eficiência operacional.

### Proposta da PEX 2
Construir um frontend navegável, com experiência de uso clara para cliente e para gestão interna, validando o fluxo de agendamento de ponta a ponta com mocks.

## 3. Objetivos desta Entrega
- Implementar uma interface web moderna para a barbearia.
- Simular o fluxo completo de agendamento no frontend.
- Estruturar área administrativa para leitura da operação.
- Validar regras de ocupação de horários com dados mockados.
- Preparar base visual e arquitetural para futura integração com backend.

## 4. Escopo da Versão Atual
### Incluído
- Home com identidade visual da barbearia (preto e amarelo).
- Página de agendamento em 4 etapas.
- Painel administrativo com métricas e filtros.
- Dados mockados de serviços, barbeiros e agendamentos.
- Bloqueio de horários ocupados para o mesmo barbeiro e data.

### Não incluído (futuras etapas)
- Persistência real em banco de dados.
- Login com autenticação real.
- Integração com API Node/Express.
- Notificações automáticas (WhatsApp, e-mail).
- Regras avançadas de permissão por perfil.

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

## 7. Descrição Funcional das Telas
### 7.1 Home (`/`)
- apresenta proposta de valor da plataforma;
- exibe serviços com preço e duração;
- mostra profissionais da barbearia;
- encaminha para agendamento e painel.

### 7.2 Agendamento (`/agendar`)
Fluxo em 4 etapas:
1. escolha do serviço;
2. escolha do barbeiro;
3. escolha de data e horário;
4. confirmação com dados do cliente.

Regras de simulação:
- horários já ocupados ficam indisponíveis;
- agendamento confirmado entra imediatamente na lista em memória (estado React);
- resumo final apresenta os dados consolidados.

### 7.3 Painel (`/painel`)
- cards com indicadores de operação;
- filtros por status (todos, confirmado, pendente, concluído, cancelado);
- listagem de agendamentos;
- leitura de demanda por serviço;
- carga de atendimento por barbeiro.

## 8. Dados Mockados
Os dados estão centralizados em `src/data/mockData.js`:
- `services`: catálogo de serviços (ticket, duração, descrição);
- `barbers`: equipe e especialidades;
- `appointments`: agenda simulada;
- `timeSlots`: horários disponíveis;
- funções auxiliares para formatação (`formatCurrency`, `formatLongDate`).

## 9. Identidade Visual
Direção visual aplicada:
- paleta principal: preto + amarelo;
- alto contraste para leitura;
- elementos com bordas e gradientes para reforçar linguagem de barbearia;
- layout responsivo para desktop e mobile.

## 10. Como Executar Localmente
### Pré-requisitos
- Node.js 18+ (recomendado 20+)
- npm

### Passos
1. abra o terminal na pasta do projeto:
   ```bash
   cd my-app
   ```
2. instale as dependências:
   ```bash
   npm install
   ```
3. execute em modo desenvolvimento:
   ```bash
   npm run dev
   ```
4. acesse a URL exibida no terminal (normalmente `http://localhost:5173`).

## 11. Scripts Disponíveis
- `npm run dev`: inicia servidor de desenvolvimento;
- `npm run build`: gera build de produção;
- `npm run preview`: visualiza build local;
- `npm run lint`: executa verificação de lint.

## 12. Principais Decisões Técnicas
- uso de React Router para separar claramente fluxos de cliente e painel;
- mocks em arquivo dedicado para facilitar futura troca por API real;
- estado local no `App.jsx` para refletir novas reservas sem backend;
- composição por páginas para manter legibilidade do código.

## 13. Riscos e Limitações da Versão Mockada
- sem persistência: recarregar página perde dados inseridos;
- sem concorrência real entre usuários;
- sem segurança/autenticação real;
- valores e métricas dependem de base estática de teste.

## 14. Possíveis Evoluções (Pós-PEX 2)
- backend com Node.js + Express;
- banco PostgreSQL para persistência;
- autenticação JWT e perfis (cliente, barbeiro, admin);
- confirmação de agendamento por notificação;
- painel com filtros por período e relatórios.

## 15. Autor
- **Caio Emanuel Amorim Gomes**

## 16. Considerações Finais
Este projeto atende ao objetivo da PEX 2 ao transformar requisitos levantados anteriormente em um frontend funcional, navegável e orientado a fluxo real de barbearia.

Mesmo com dados mockados, a aplicação valida as decisões de UX, estrutura de navegação e lógica básica de agenda, criando uma base consistente para a próxima etapa com backend e persistência real.
