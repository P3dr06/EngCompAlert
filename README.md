# EngComp Alert – Sistema de Notificações em Tempo Real

Aplicativo mobile (Expo / React Native) que usa **Supabase Realtime (WebSockets)** para avisar
todos os celulares conectados assim que um aviso é inserido no banco de dados.

**Fluxo:** Coordenador insere um aviso → PostgreSQL (`notifications`) → Realtime detecta o
`INSERT` → todos os apps abertos recebem o evento → **Expo Notifications** exibe o alerta.

## Como testar

Pré-requisitos: **Node.js** instalado no computador e o app **Expo Go** (SDK 58) no celular.

```bash
npm install
npx expo start -c
```

1. Celular e computador na **mesma rede Wi-Fi**. Escaneie o QR Code com o Expo Go.
   Se a rede bloquear a conexão, use o modo tunnel: `npx expo login` e depois
   `npx expo start --tunnel -c`.
2. Aceite a permissão de notificações.
3. Na "Área do Coordenador", preencha título e mensagem e toque em **DISPARAR ALERTA**.
4. A notificação aparece no aparelho (e em todos os aparelhos com o app aberto), e o aviso
   fica registrado na tabela `notifications` do Supabase.

As chaves do Supabase (URL e publishable key) já estão configuradas em
`src/services/supabase.js` e a tabela `notifications` já existe no projeto, então não é
necessário configurar nada para o teste.

## Estrutura

```
EngCompAlert/
├── App.js                            # Tela, escuta Realtime e envio de avisos
├── src/
│   ├── services/supabase.js          # Conexão com o Supabase
│   └── helper/notificationsHelper.js # Permissão e disparo da notificação local
├── supabase/setup.sql                # Tabela + RLS + Realtime
├── app.json
└── package.json
```

## Backend (Supabase)

Para recriar o backend em outro projeto Supabase, execute `supabase/setup.sql` no
**SQL Editor**. Ele cria a tabela `notifications` (`id`, `title`, `body`, `created_at`),
ativa o RLS, cria a política de leitura/escrita e habilita o Realtime na tabela.
Depois, troque a URL e a chave em `src/services/supabase.js` pelas de
**Project Settings > API**.

> A política de acesso liberado para todos é didática. Em produção, restrinja o INSERT a
> um coordenador autenticado.

## Observações

- A notificação é **local**, disparada pelo evento Realtime, e funciona com o app aberto
  ou em segundo plano ativo.
- No Expo Go (a partir do SDK 53) o push remoto não está disponível e aparecem avisos
  `WARN` no console. Eles não impedem o funcionamento. Para push remoto é necessário um
  Development Build: `eas build --platform android --profile development`.
