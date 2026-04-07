# FinanceX 💰

Controle financeiro pessoal com IA, armazenamento em nuvem (Firebase) e deploy gratuito (Vercel).

## Estrutura

```
financex/
├── api/
│   └── chat.js          ← Proxy seguro para a API da Anthropic (roda no servidor)
├── public/
│   └── index.html       ← App completo (React + Firebase)
├── package.json
├── vercel.json
└── README.md
```

---

## Deploy em 4 passos (~15 minutos)

### 1. Firebase — banco de dados gratuito

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto** → dê um nome → desative o Google Analytics → Criar
3. No menu lateral, clique em **Firestore Database** → **Criar banco de dados**
   - Escolha **Modo de teste** (permite leitura/escrita por 30 dias — ajuste as regras depois)
   - Escolha a região mais próxima (ex: `southamerica-east1`)
4. Vá em **Configurações do projeto** (ícone de engrenagem) → aba **Geral**
5. Em "Seus apps", clique em **</>** (Web) → registre com qualquer nome
6. Copie o objeto `firebaseConfig` — você vai precisar dele depois

**Regras de segurança recomendadas** (após configurar):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /financex/{doc} {
      allow read, write: if true;  // Pessoal — sem autenticação
    }
  }
}
```

---

### 2. Anthropic — chave de API

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma conta (tem crédito gratuito inicial)
3. Vá em **API Keys** → **Create Key**
4. Copie a chave (`sk-ant-...`) — você vai precisar no próximo passo

---

### 3. GitHub — repositório

1. Crie uma conta em [github.com](https://github.com) se ainda não tiver
2. Clique em **New repository** → nome: `financex` → **Create**
3. Faça upload desta pasta (arraste os arquivos) ou use Git:

```bash
git init
git add .
git commit -m "FinanceX inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/financex.git
git push -u origin main
```

---

### 4. Vercel — deploy e variável de ambiente

1. Acesse [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Clique em **Add New Project** → importe o repositório `financex`
3. Antes de fazer o deploy, configure a variável de ambiente:
   - Em **Environment Variables**, adicione:
     - **Nome:** `ANTHROPIC_API_KEY`
     - **Valor:** `sk-ant-...` (sua chave da Anthropic)
4. Clique em **Deploy**
5. Aguarde ~1 minuto — você receberá uma URL como `financex.vercel.app`

---

## Primeiro acesso

1. Abra a URL do Vercel
2. O app pedirá a configuração do Firebase
3. Cole os valores do `firebaseConfig` copiado no passo 1
4. Pronto — dados salvos na nuvem, IA funcionando!

---

## Atualizações futuras

Qualquer `git push` para `main` faz o redeploy automático no Vercel.

---

## Custos (tudo gratuito para uso pessoal)

| Serviço | Plano | Limite gratuito |
|---------|-------|-----------------|
| Firebase Firestore | Spark (Free) | 1 GB armazenamento, 50k leituras/dia |
| Vercel | Hobby (Free) | 100 GB bandwidth, serverless functions ilimitadas |
| Anthropic API | Pay-as-you-go | ~$5 de crédito inicial grátis |
