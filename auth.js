/* ============================================================================
   MÓDULO JS — AUTENTICAÇÃO (Firebase Authentication, e-mail/senha)
   Responsável por: exibir a tela de login, alternar entre "Entrar" e
   "Criar conta", recuperação de senha, logout, e liberar o acesso ao
   restante do sistema (appRoot) somente após o usuário estar autenticado.
   ============================================================================ */

(function(){

  const loginScreen   = document.getElementById("loginScreen");
  const appRoot        = document.getElementById("appRoot");
  const configWarning  = document.getElementById("loginConfigWarning");

  const tabEntrar   = document.getElementById("tabEntrar");
  const tabCriar    = document.getElementById("tabCriar");
  const formEntrar  = document.getElementById("formEntrar");
  const formCriar   = document.getElementById("formCriar");
  const loginAlert  = document.getElementById("loginAlert");
  const loginTitle  = document.getElementById("loginTitle");
  const loginSub    = document.getElementById("loginSub");

  // --------------------------------------------------------------------
  // Se o Firebase ainda não foi configurado (js/firebase-config.js com os
  // valores de exemplo), avisamos na tela em vez de deixar o console
  // estourar erros confusos, e desabilitamos os formulários.
  // --------------------------------------------------------------------
  if (typeof firebaseConfigPendente !== "undefined" && firebaseConfigPendente) {
    configWarning.style.display = "flex";
    [...document.querySelectorAll(".login-form input, .login-form button")]
      .forEach(el => el.disabled = true);
    return;
  }

  const auth = firebase.auth();

  // --------------------------------------------------------------------
  // Alternância de abas: "Entrar" / "Criar conta"
  // --------------------------------------------------------------------
  function mostrarAba(aba){
    const isEntrar = aba === "entrar";
    tabEntrar.classList.toggle("active", isEntrar);
    tabCriar.classList.toggle("active", !isEntrar);
    formEntrar.classList.toggle("hidden", !isEntrar);
    formCriar.classList.toggle("hidden", isEntrar);
    loginTitle.textContent = isEntrar ? "Bem-vindo de volta" : "Criar nova conta";
    loginSub.textContent = isEntrar
      ? "Entre com seu e-mail e senha para acessar o almoxarifado."
      : "Cadastre-se para começar a usar o sistema.";
    esconderAlerta();
  }
  tabEntrar.addEventListener("click", () => mostrarAba("entrar"));
  tabCriar.addEventListener("click", () => mostrarAba("criar"));

  // --------------------------------------------------------------------
  // Alerta (erro / sucesso) da tela de login
  // --------------------------------------------------------------------
  function mostrarAlerta(mensagem, tipo){
    loginAlert.textContent = "";
    const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icone.setAttribute("viewBox", "0 0 24 24");
    icone.setAttribute("fill", "none");
    icone.setAttribute("stroke", "currentColor");
    icone.setAttribute("stroke-width", "2");
    icone.innerHTML = tipo === "success"
      ? '<path d="M20 6L9 17l-5-5"/>'
      : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/>';
    const span = document.createElement("span");
    span.textContent = mensagem;
    loginAlert.appendChild(icone);
    loginAlert.appendChild(span);
    loginAlert.className = "login-alert show" + (tipo === "success" ? " success" : "");
  }
  function esconderAlerta(){
    loginAlert.className = "login-alert";
    loginAlert.textContent = "";
  }

  // --------------------------------------------------------------------
  // Tradução das mensagens de erro mais comuns do Firebase Auth
  // --------------------------------------------------------------------
  function mensagemErro(err){
    const mapa = {
      "auth/invalid-email":        "E-mail inválido.",
      "auth/user-disabled":        "Esta conta foi desativada.",
      "auth/user-not-found":       "Não encontramos uma conta com este e-mail.",
      "auth/wrong-password":       "Senha incorreta.",
      "auth/invalid-credential":   "E-mail ou senha incorretos.",
      "auth/invalid-login-credentials": "E-mail ou senha incorretos.",
      "auth/email-already-in-use": "Já existe uma conta com este e-mail.",
      "auth/weak-password":        "A senha deve ter pelo menos 6 caracteres.",
      "auth/too-many-requests":    "Muitas tentativas. Aguarde um momento e tente novamente.",
      "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
    };
    return mapa[err.code] || "Ocorreu um erro. Tente novamente.";
  }

  function alternarCarregando(botao, carregando){
    botao.classList.toggle("loading", carregando);
    botao.disabled = carregando;
  }

  // --------------------------------------------------------------------
  // Mostrar/ocultar senha
  // --------------------------------------------------------------------
  document.querySelectorAll(".login-toggle-pw").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      input.type = input.type === "password" ? "text" : "password";
      btn.classList.toggle("is-visible");
    });
  });

  // --------------------------------------------------------------------
  // Formulário: ENTRAR
  // --------------------------------------------------------------------
  formEntrar.addEventListener("submit", (e) => {
    e.preventDefault();
    esconderAlerta();
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const botao = document.getElementById("btnEntrar");
    if (!email || !senha) { mostrarAlerta("Preencha e-mail e senha."); return; }

    alternarCarregando(botao, true);
    auth.signInWithEmailAndPassword(email, senha)
      .catch(err => mostrarAlerta(mensagemErro(err)))
      .finally(() => alternarCarregando(botao, false));
  });

  // --------------------------------------------------------------------
  // Formulário: CRIAR CONTA
  // --------------------------------------------------------------------
  formCriar.addEventListener("submit", (e) => {
    e.preventDefault();
    esconderAlerta();
    const nome  = document.getElementById("criarNome").value.trim();
    const email = document.getElementById("criarEmail").value.trim();
    const senha = document.getElementById("criarSenha").value;
    const senha2 = document.getElementById("criarSenha2").value;
    const botao = document.getElementById("btnCriar");

    if (!nome || !email || !senha || !senha2) { mostrarAlerta("Preencha todos os campos."); return; }
    if (senha.length < 6) { mostrarAlerta("A senha deve ter pelo menos 6 caracteres."); return; }
    if (senha !== senha2) { mostrarAlerta("As senhas não coincidem."); return; }

    alternarCarregando(botao, true);
    auth.createUserWithEmailAndPassword(email, senha)
      .then(cred => cred.user.updateProfile({ displayName: nome }))
      .catch(err => mostrarAlerta(mensagemErro(err)))
      .finally(() => alternarCarregando(botao, false));
  });

  // --------------------------------------------------------------------
  // Esqueci minha senha
  // --------------------------------------------------------------------
  document.getElementById("btnEsqueciSenha").addEventListener("click", () => {
    esconderAlerta();
    const email = document.getElementById("loginEmail").value.trim();
    if (!email) { mostrarAlerta("Digite seu e-mail no campo acima e clique novamente."); return; }
    auth.sendPasswordResetEmail(email)
      .then(() => mostrarAlerta("Enviamos um link de redefinição de senha para o seu e-mail.", "success"))
      .catch(err => mostrarAlerta(mensagemErro(err)));
  });

  // --------------------------------------------------------------------
  // Logout — o botão é criado dinamicamente dentro do header do app
  // (ver showApp) para não depender da ordem de carregamento dos scripts.
  // --------------------------------------------------------------------
  function fazerLogout(){
    auth.signOut();
  }
  window.fazerLogoutAlmoxarifado = fazerLogout;

  // --------------------------------------------------------------------
  // Alterna entre tela de login e o sistema, conforme o estado de auth
  // --------------------------------------------------------------------
  function showApp(user){
    loginScreen.style.display = "none";
    appRoot.style.display = "";
    formEntrar.reset();
    formCriar.reset();
    esconderAlerta();

    if (typeof window.config === "object") {
      window.config.usuario = user.displayName || user.email || "Usuário";
    }
    if (typeof window.atualizarUsuarioHeader === "function") window.atualizarUsuarioHeader();
    if (typeof window.initApp === "function") window.initApp();
    inserirBotaoLogout();
  }

  function showLogin(){
    appRoot.style.display = "none";
    loginScreen.style.display = "flex";
    mostrarAba("entrar");
  }

  // Insere (uma única vez) o botão de "Sair" ao lado do chip de usuário
  function inserirBotaoLogout(){
    const chip = document.querySelector(".user-chip");
    if (!chip || document.getElementById("btnLogoutHeader")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "btnLogoutHeader";
    btn.className = "logout-btn";
    btn.title = "Sair";
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
    btn.addEventListener("click", fazerLogout);
    chip.parentElement.appendChild(btn);
  }

  auth.onAuthStateChanged(user => {
    if (user) showApp(user); else showLogin();
  });

})();
