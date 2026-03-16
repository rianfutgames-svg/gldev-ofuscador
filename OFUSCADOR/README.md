# CodeGuard - Ofuscação e Licenciamento

Site para ofuscar código JavaScript e gerar/injetar licenças no seu código.

## Funcionalidades

### 1. Ofuscação de JavaScript
- Cole seu código JavaScript e obtenha uma versão ofuscada
- Opções: compactar, criptografar strings, control flow flattening, código morto
- Use a biblioteca [javascript-obfuscator](https://obfuscator.io/)

### 2. Gerador de Licenças
- Gere chaves de licença únicas (formato: XXXX-XXXX-XXXX-XXXX-EXPIRY)
- Configure email do cliente e validade em dias
- Injete verificação de licença no seu código (o código só executa se a licença for válida)

## Como usar

1. Abra o arquivo `index.html` no navegador (ou sirva via um servidor local)
2. **Ofuscar**: Aba "Ofuscar Código" → cole o JS → clique em Ofuscar → copie o resultado
3. **Licença**: Aba "Gerar Licença" → preencha os dados → Gere → use "Injetar Proteção" no seu código

## Estrutura

```
├── index.html   # Página principal
├── styles.css   # Estilos
├── app.js       # Lógica da aplicação
└── README.md    # Este arquivo
```

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- Conexão com internet (para carregar a biblioteca de ofuscação via CDN)
