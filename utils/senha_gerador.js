console.log("Script senha_gerador.js carregado com sucesso");

// DOM Elements
const gerarBtn = document.getElementById('gerar-btn');
const modal = document.getElementById('senhaModal');
const closeBtn = document.querySelector('.close');
const copyBtn = document.getElementById('copy-btn');
const tooltip = document.getElementById('tooltip');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

console.log("Elementos DOM capturados:", { gerarBtn, modal, closeBtn, copyBtn, tooltip, themeToggle });

// Theme Management
const savedTheme = localStorage.getItem('theme') || 'light';
console.log("Tema carregado:", savedTheme);
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    console.log("Botão de tema clicado");
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    console.log("Alterando tema para:", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    console.log("Atualizando ícone do tema:", theme);
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Event Listeners
gerarBtn.addEventListener('click', () => {
    console.log("Botão Gerar clicado");
    gerarSenha();
});
closeBtn.addEventListener('click', () => {
    console.log("Botão Fechar clicado");
    fecharModal();
});
copyBtn.addEventListener('click', () => {
    console.log("Botão Copiar clicado");
    copiarSenha();
});

// Functions
function gerarSenhaAleatoria(comprimento, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos) {
    console.log("Gerando senha com:", { comprimento, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos });
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let caracteres = '';
    
    if (usarMaiusculas) caracteres += maiusculas;
    if (usarMinusculas) caracteres += minusculas;
    if (usarNumeros) caracteres += numeros;
    if (usarSimbolos) caracteres += simbolos;
    
    if (!caracteres) {
        console.log("Erro: Nenhum tipo de caractere selecionado");
        return null;
    }
    
    let senha = '';
    for (let i = 0; i < comprimento; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        senha += caracteres[indice];
    }
    console.log("Senha gerada:", senha);
    return senha;
}

function calcularForcaSenha(senha) {
    console.log("Calculando força da senha:", senha);
    let score = 0;
    if (senha.length >= 12) score += 2;
    else if (senha.length >= 8) score += 1;
    
    if (/[A-Z]/.test(senha)) score += 1;
    if (/[a-z]/.test(senha)) score += 1;
    if (/[0-9]/.test(senha)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(senha)) score += 1;
    
    if (score >= 5) return { texto: 'Forte', classe: 'strength-strong' };
    if (score >= 3) return { texto: 'Média', classe: 'strength-medium' };
    return { texto: 'Fraca', classe: 'strength-weak' };
}

function gerarSenha() {
    console.log("Iniciando função gerarSenha");
    const comprimento = parseInt(document.getElementById('comprimento').value);
    const usarMaiusculas = document.getElementById('maiusculas').checked;
    const usarMinusculas = document.getElementById('minusculas').checked;
    const usarNumeros = document.getElementById('numeros').checked;
    const usarSimbolos = document.getElementById('simbolos').checked;
    
    console.log("Dados de entrada:", { comprimento, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos });

    // Validações
    if (isNaN(comprimento) || comprimento < 6 || comprimento > 50) {
        console.log("Erro: Comprimento inválido");
        showError("O comprimento deve ser entre 6 e 50 caracteres");
        return;
    }
    
    if (!usarMaiusculas && !usarMinusculas && !usarNumeros && !usarSimbolos) {
        console.log("Erro: Pelo menos um tipo de caractere deve ser selecionado");
        showError("Selecione pelo menos um tipo de caractere");
        return;
    }
    
    const senha = gerarSenhaAleatoria(comprimento, usarMaiusculas, usarMinusculas, usarNumeros, usarSimbolos);
    if (!senha) {
        console.log("Erro: Falha ao gerar senha");
        showError("Não foi possível gerar a senha");
        return;
    }
    
    const forca = calcularForcaSenha(senha);
    console.log("Força da senha:", forca);
    
    const passwordText = document.getElementById('modalPasswordText');
    const strengthText = document.getElementById('passwordStrength');
    
    passwordText.textContent = senha;
    strengthText.textContent = `Força: ${forca.texto}`;
    strengthText.className = `password-strength ${forca.classe}`;
    
    console.log("Conteúdo do modal atualizado, chamando abrirModal");
    abrirModal();
    clearError();
}

function abrirModal() {
    console.log("Abrindo modal");
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    console.log("Classe 'show' adicionada ao modal, overflow definido como hidden");
}

function fecharModal() {
    console.log("Fechando modal");
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    console.log("Classe 'show' removida do modal, overflow restaurado");
}

function copiarSenha() {
    console.log("Iniciando cópia da senha");
    const passwordText = document.getElementById('modalPasswordText').textContent;
    navigator.clipboard.writeText(passwordText).then(() => {
        console.log("Senha copiada com sucesso:", passwordText);
        tooltip.classList.add('show');
        setTimeout(() => {
            console.log("Removendo tooltip após 2 segundos");
            tooltip.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error("Erro ao copiar senha:", err);
        alert("Não foi possível copiar a senha");
    });
}

function showError(message) {
    console.log("Exibindo mensagem de erro:", message);
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError() {
    console.log("Limpando mensagem de erro");
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
}

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        console.log("Clicado fora do modal, fechando");
        fecharModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        console.log("Tecla ESC pressionada, fechando modal");
        fecharModal();
    }
});