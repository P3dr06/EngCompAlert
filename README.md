# EngComp Alert – Sistema de Notificações em Tempo Real

Aplicativo mobile (Expo / React Native) que usa **Supabase Realtime (WebSockets)** para
avisar todos os celulares conectados assim que um aviso é inserido no banco de dados.

**Fluxo:** Coordenador insere um aviso → PostgreSQL (`notifications`) → Realtime detecta o
`INSERT` → todos os apps abertos recebem o evento → **Expo Notifications** exibe o alerta.

## Estrutura

```
EngCompAlert/
├── App.js                           # Tela, escuta Realtime e envio de avisos
├── src/
│   ├── services/supabase.js         # Conexão com o Supabase
│   └── helper/notificationsHelper.js# Permissão e disparo da notificação local
├── supabase/setup.sql               # Tabela + RLS + Realtime (opcional)
├── app.json
└── package.json
```

## 1. Backend (Supabase)

Opção A – SQL: abra **SQL Editor**, cole o conteúdo de `supabase/setup.sql` e execute.

Opção B – pelo painel:
1. **Table Editor > New Table**, nome `notifications`.
2. Marque **Enable Row Level Security (RLS)** e **Enable Realtime**.
3. Colunas: `id` (int8, primary key, auto increment), `title` (text), `body` (text),
   `created_at` (timestamptz, default `now()`).
4. **Authentication > Policies** na tabela **notifications** > **Create Policy**:
   nome `Enabled read/write for all users`, comando **ALL**, expressões `using` e
   `with check` = `true`.

> A política `true` é apenas didática: qualquer pessoa com a chave anon pode ler e
> inserir avisos. Em produção, restrinja o INSERT ao coordenador autenticado.

## 2. Configurar as chaves

Em `src/services/supabase.js`, troque `SUA_URL_DO_SUPABASE` e `SUA_CHAVE_ANON_PUBLICA`
pelos valores de **Project Settings > API** (use a chave `anon` / publishable, nunca a
`service_role`).

## 3. Rodar

```bash
npm install
npx expo start --tunnel
```

Escaneie o QR Code com o app **Expo Go**, aceite a permissão de notificações e, em
outro celular (ou no mesmo), envie um aviso pela "Área do Coordenador".

## Observações

- A notificação é **local**, disparada pelo evento Realtime; funciona com o app aberto
  (ou em segundo plano ativo).
- No Expo Go (SDK 53+) há limitações para push remoto e pode aparecer um aviso no
  console, sem impedir o funcionamento. Para push remoto use um Development Build:
  `eas build --platform android --profile development`.

## Recriar o projeto do zero (comandos da aula)

```bash
npx create-expo-app EngCompAlert -t blank
cd EngCompAlert
npx expo install expo-notifications expo-device
npm install @supabase/supabase-js react-native-url-polyfill
```
