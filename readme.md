# Muffins Corp. JavaScript Client Library

Uma biblioteca cliente Node.js para interagir com a API de Inteligencia Artificial da Muffins Corp (Muffins AI).

## Instalação

```bash
npm install muffinscorp
```

## Uso Básico

```javascript
const { MuffinsCorp } = require("muffinscorp");

// Inicialização com API key
const muffinsai = new MuffinsCorp({
  apiKey: "sua-api-key",
  // Opcional: URL base customizada
  // baseURL: 'https://custom-api-endpoint.com'
});

// Exemplo: Listar modelos
async function getModels() {
  const models = await muffinsai.models.list();
  console.log(models);
}

// Exemplo: Completar chat
async function createChatCompletion() {
  const completion = await muffinsai.chat.create({
    messages: [
      { role: "system", content: "Você é um assistente útil." },
      { role: "user", content: "Olá, mundo!" },
    ],
    model: "chat-model-small",
    stream: false, // Definir como true para respostas em stream
  });

  console.log(completion);
}

// Exemplo: Ver saldo de créditos
async function getCredits() {
  const balance = await muffinsai.credits.getBalance();
  console.log(balance);
}
```

## Referência da API

### Configuração

Opções ao inicializar `MuffinsCorp`:

- `apiKey` (obrigatório) - Sua chave da API MuffinsCorp ou Muffins AI
- `baseURL` (opcional) - Endpoint customizado

### Principais Métodos

**Chat:**

- `muffinsai.chat.create(options)` - Cria completação de chat
  - `messages`: Array de mensagens com `role` e `content`
  - `model`: Modelo a usar (default: "chat-model-small")
  - `stream`: Habilitar streaming (default: true)

**Models:**

- `muffinsai.models.list()` - Lista modelos disponíveis

**Credits:**

- `muffinsai.credits.getBalance()` - Retorna saldo de créditos

## Tratamento de Erros

```javascript
try {
  await muffinsai.chat.create({
    messages: [{ role: "user", content: "Hello" }],
  });
} catch (error) {
  console.error("Erro na API:", error.message);
}
```

## Streaming

Para respostas em streaming:

```javascript
const stream = await muffinsai.chat.create({
  messages: [{ role: "user", content: "Conte uma história" }],
  stream: true,
});

// Processar o stream conforme necessário
```
