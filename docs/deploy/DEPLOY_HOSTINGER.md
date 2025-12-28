# Deploy na Hostinger com Supabase

Guia passo a passo para publicar o Arquimedes em uma VPS Hostinger já provisionada com Supabase.

## 1) Acessar a VPS
- **Host:** `srv1180544.hstgr.cloud`
- **Usuário:** `supabase`
- **Senha:** `Mscconsultoria@1994`
- Opcionalmente cadastre sua chave SSH e desabilite login por senha após o primeiro acesso.

```bash
ssh supabase@srv1180544.hstgr.cloud
```

## 2) Preparar ambiente
1. **Atualizar pacotes**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
2. **Instalar Node.js 22 e pnpm** (via corepack)
   ```bash
   sudo apt install -y ca-certificates curl build-essential
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo corepack enable
   sudo corepack prepare pnpm@10 --activate
   ```
3. (Opcional) Instalar `pm2` para rodar o servidor em background:
   ```bash
   sudo pnpm add -g pm2
   ```

## 3) Obter código e configurar variáveis
1. **Clonar o repositório** (ou sincronizar a partir do Git que você utiliza):
   ```bash
   git clone https://github.com/MSC-Consultoria/arquimedes0.0.1.git
   cd arquimedes0.0.1
   ```
2. **Criar o arquivo `.env`** a partir do modelo e preencher credenciais do Supabase:
   ```bash
   cp .env.example .env
   ```
   Defina estes valores (os quatro são obrigatórios quando `DB_MODE=supabase`):
   ```env
   DB_MODE=supabase
   SUPABASE_URL=https://<sua-instancia>.supabase.co
   SUPABASE_ANON_KEY=<chave-publica>
   SUPABASE_SERVICE_KEY=<chave-de-servico>
   SUPABASE_DATABASE_URL=postgresql://postgres:<senha>@<host>:5432/postgres
   ```
   > Use as chaves e a URL fornecidas pelo seu projeto Supabase. A `SUPABASE_DATABASE_URL` deve apontar para o banco PostgreSQL criado no Supabase.

## 4) Instalar dependências e preparar banco
```bash
pnpm install
pnpm db:push   # gera e aplica migrations
pnpm seed      # (opcional) popula o banco com dados de exemplo
```

## 5) Build e execução
- **Build de produção**
  ```bash
  pnpm build
  ```
- **Rodar o servidor**
  ```bash
  pnpm start          # mantém na sessão atual
  # ou usando pm2
  pm2 start "pnpm start" --name arquimedes
  pm2 save
  ```
- O servidor roda na porta `3000` por padrão. Em produção, configure um proxy reverso (Nginx) para expor na porta 80/443.

## 6) DNS e HTTPS
- O domínio `mscconsultoriarj.com.br` aponta para o IP `72.62.9.90` (IPv4) / `2a02:4780:66:437e::1` (IPv6).
- Crie/ajuste o recorde `A` (e `AAAA` se usar IPv6) para o servidor onde o Nginx está configurado.
- No Nginx, faça o proxy para `http://127.0.0.1:3000` e gere certificados com Let’s Encrypt (ex.: usando `certbot`).

## 7) Checklist rápido
- [ ] `.env` preenchido com variáveis do Supabase
- [ ] `pnpm db:push` executado sem erros
- [ ] `pnpm build` finalizado
- [ ] Processo iniciado (`pnpm start` ou `pm2`) e respondendo em `http://localhost:3000`
- [ ] Proxy reverso + HTTPS configurados para `mscconsultoriarj.com.br`

## 8) Manutenção
- Atualizar código: `git pull` e reexecutar `pnpm install && pnpm build && pm2 restart arquimedes`
- Ver logs: `pm2 logs arquimedes`
- Reiniciar manualmente: `pm2 restart arquimedes` ou `pnpm start` novamente
