# Sistema de Notificações Real-Time 🔔

> *Sistema de notificações em tempo real com painel admin, níveis de prioridade e marcação de leitura.*

## Sobre o Projeto

Sistema completo de notificações real-time para aplicações web. O usuário recebe alertas ao vivo no navegador, sem refresh, com suporte a múltiplos usuários e três níveis de prioridade.

O projeto foi criado durante um desafio ao vivo no canal da [Codecon](https://youtube.com/codecondev), onde um dev júnior, um pleno e um sênior construíram suas versões em 2 horas.

## Funcionalidades

- **Notificações em tempo real** — Via WebSocket, sem refresh
- **Painel de admin** — Dispara notificações para um ou mais usuários
- **Marcar como lida** — Controle de estado por notificação
- **Níveis de prioridade** — Informação, alerta e crítico com tratamento visual distinto
- **Notificação crítica impossível de ignorar** — Destaque visual e/ou sonoro

### Extras (variam por implementação)
- Contador de não-lidas
- Som ou animação ao receber
- Histórico de notificações
- Push notification nativa do browser
- Suporte a múltiplos usuários simultâneos

## 📁 Estrutura do Repositório

```
/
├── junior/
│   └── README.md
├── pleno/
│   └── README.md
├── senior/
│   └── README.md
└── README.md
```

Cada pasta contém a implementação completa de um participante com sua própria stack e abordagem.

## Rodando Localmente

Acesse a pasta da implementação que quiser testar e siga o README específico de cada uma.

## Participe Você Também!

**Acha que consegue fazer a sua versão?**

1. **Fork** este repositório
2. Crie uma pasta com seu nome/username
3. Desenvolva seu sistema de notificações
4. Documente no README: stack, arquitetura, como implementou prioridades e aprendizados
5. Abra um **Pull Request**

## Conceitos-Chave

- **WebSocket** — Conexão bidirecional persistente entre client e server
- **Server-Sent Events (SSE)** — Alternativa unidirecional (server → client), mais simples que WebSocket
- **Estado de Leitura** — Controlar quais notificações o usuário já viu
- **Priorização** — Crítico, alerta e info precisam de tratamentos visuais diferentes
- **Reconexão** — O que acontece quando o WebSocket cai? O client precisa reconectar

## Licença

MIT

---

*Projeto desenvolvido para o canal da [Codecon](https://youtube.com/codecondev)*
