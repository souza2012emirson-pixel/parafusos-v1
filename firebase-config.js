/* ============================================================================
   FIREBASE — CONFIGURAÇÃO E INICIALIZAÇÃO
   ============================================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyB5Ywj-tKyDVY9JQlJkBrLrOR7PMDFz1-E",
  authDomain: "almoxarifado-emmy.firebaseapp.com",
  projectId: "almoxarifado-emmy",
  storageBucket: "almoxarifado-emmy.firebasestorage.app",
  messagingSenderId: "880201204921",
  appId: "1:880201204921:web:a3a9c693ce17e505de0768",
};

const firebaseConfigPendente = firebaseConfig.apiKey === "SUA_API_KEY_AQUI";

let db;
if (!firebaseConfigPendente) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}
