# Sistema de Almoxarifado 2.0

Projeto separado em arquivos + tela de login com Firebase Authentication.

## Estrutura de arquivos

```
almoxarifado/
├── index.html          → estrutura da página (login + sistema)
├── css/
│   ├── style.css        → estilos originais do sistema (dashboard, cards, modais...)
│   └── login.css        → estilos da tela de login/cadastro
├── js/
│   ├── firebase-config.js  → suas credenciais do Firebase (edite este arquivo)
│   ├── auth.js              → login, criar conta, esqueci senha, logout
│   └── app.js                → toda a lógica do sistema (itens, estoque, relatórios...)
└── README.md
```

## Como configurar o login (Firebase)

1. Acesse **https://console.firebase.google.com/** e crie um projeto (é grátis).
2. No menu lateral: **Compilação → Authentication → Sign-in method** → ative o
   provedor **E-mail/senha**.
3. Vá em **⚙️ Configurações do projeto → Seus aplicativos → ícone "</>"
   (Web)** e registre um app (não precisa do Firebase Hosting).
4. Copie o objeto `firebaseConfig` mostrado e cole em `js/firebase-config.js`,
   substituindo os valores de exemplo (`SUA_API_KEY_AQUI`, etc.).
5. Salve e abra `index.html` no navegador (ou publique os arquivos em
   qualquer servidor/hospedagem estática).

Enquanto `js/firebase-config.js` não for editado, a tela de login mostra um
aviso e mantém os formulários desabilitados — isso é esperado.

## Como funciona a tela de login

- **Entrar**: autentica com e-mail e senha via Firebase Authentication.
- **Criar conta**: cria um novo usuário (nome, e-mail, senha) — a senha
  precisa ter ao menos 6 caracteres.
- **Esqueci minha senha**: envia um e-mail de redefinição de senha.
- Ao autenticar, o nome/e-mail do usuário aparece no cabeçalho do sistema, e
  um botão de **Sair** (ícone ao lado do avatar) faz logout e volta para a
  tela de login.
- O sistema (`#appRoot`) só é exibido depois que o Firebase confirma a
  sessão; sem login, apenas a tela de login aparece.

## Observação sobre os dados do sistema

Os dados de itens do almoxarifado continuam em memória (como no arquivo
original) — o Firebase aqui cuida **apenas do login/autenticação**, não do
armazenamento dos itens. Use os botões **Backup** e **Restaurar Backup** do
sistema para salvar/recuperar os dados em um arquivo `.json`.
