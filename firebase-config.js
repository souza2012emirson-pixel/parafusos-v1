/* ============================================================================
   FIREBASE — CONFIGURAÇÃO E INICIALIZAÇÃO
   ============================================================================
   Como configurar:
   1. Acesse https://console.firebase.google.com/ e crie um projeto (ou use
      um existente).
   2. No menu lateral vá em "Compilação" → "Authentication" → aba "Sign-in
      method" e ative o provedor "E-mail/senha".
   3. Ainda no console, clique no ícone de engrenagem → "Configurações do
      projeto" → role até "Seus aplicativos" → clique no ícone "</>" (Web) →
      registre um app (não precisa marcar Firebase Hosting).
   4. O Firebase vai te mostrar um objeto "firebaseConfig" — copie os
      valores para o objeto abaixo, substituindo os placeholders.
   5. Salve este arquivo. Nenhuma outra alteração é necessária: auth.js e
      app.js já foram preparados para usar esta configuração.
   ============================================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyB5Ywj-tKyDVY9JQlJkBrLrOR7PMDFz1-E",
  authDomain: "almoxarifado-emmy.firebaseapp.com",
  projectId: "almoxarifado-emmy",
  storageBucket: "almoxarifado-emmy.firebasestorage.app",
  messagingSenderId: "880201204921",
  appId: "1:880201204921:web:a3a9c693ce17e505de0768",
};

// Sinaliza se a configuração ainda está com os valores de exemplo, para
// exibirmos um aviso amigável na tela de login em vez de um erro confuso.
const firebaseConfigPendente = firebaseConfig.apiKey === "SUA_API_KEY_AQUI";

if (!firebaseConfigPendente) {
  firebase.initializeApp(firebaseConfig);
}
