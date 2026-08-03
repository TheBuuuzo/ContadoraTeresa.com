# ContadoraTeresa.com

Site profissional de campanha para **Teresa Castro** — contabilidade e gestão para candidaturas na Eleição 2026.

**Domínio público:** `https://contadorateresa.com.br`  
**Porta local (Painel):** `192.168.15.101:5020`

## Conteúdo

- Apresentação da estrutura do escritório e facilitadores digitais
- Checklist interativo de orçamento
- Envio automático para **Propostas Eleitorais** no Marrone (`status: pendente`)

## Desenvolvimento

```bash
npm install
npm run dev
```

Para o proxy de orçamento no `npm run dev`, copie `.env.example` → `.env` e preencha a mesma `CONECTA_INTEGRATION_KEY` do Marrone.

## Produção (Painel de Servidores)

```bash
npm run build
Init_ContadoraTeresa.bat
```

Ou pelo Painel (`Painel-App.bat` / `Painel-Servidores.bat`) — serviço **ContadoraTeresa**.

No Cloudflare Tunnel, aponte:

| Hostname | Service |
|---|---|
| `contadorateresa.com.br` | `http://192.168.15.101:5020` |

No servidor, o projeto deve estar em `C:\GitHub\ContadoraTeresa.com` (como os demais).

## Integração Marrone

1. O formulário envia `POST /api/orcamento` no ContadoraTeresa.
2. O `server.mjs` encaminha para o Marrone:  
   `POST /api/integracao/propostas-eleitorais/lead` com `X-Integracao-Key`.
3. A proposta aparece em **Eleitoral → Propostas Eleitorais** como pendente, marcada com `origem: contadorateresa`.

Opcional no `.env` do Marrone:

```env
TERESA_PROPOSTA_USUARIO_ID=1
TERESA_INTEGRATION_KEY=
```
