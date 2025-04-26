console.log("Script pix_pay.js carregado com sucesso");

// DOM Elements
const gerarBtn = document.getElementById('gerar-btn');
const modal = document.getElementById('pixModal');
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
    gerarPix();
});
closeBtn.addEventListener('click', () => {
    console.log("Botão Fechar clicado");
    fecharModal();
});
copyBtn.addEventListener('click', () => {
    console.log("Botão Copiar clicado");
    copiarPayload();
});

// Functions
function calculateCRC16(data) {
    console.log("Calculando CRC16 para:", data);
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    for (let i = 0; i < data.length; i++) {
        let byte = data.charCodeAt(i);
        crc ^= (byte << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
            crc &= 0xFFFF;
        }
    }
    const result = crc.toString(16).toUpperCase().padStart(4, '0');
    console.log("CRC16 calculado:", result);
    return result;
}

function gerarPayload(chave, valor, txid) {
    console.log("Gerando payload com:", { chave, valor, txid });
    const nome = "N"; // Fixo conforme especificação
    const cidade = "C"; // Fixo conforme especificação
    
    const payload = [];
    payload.push("000201"); // Payload Format Indicator
    payload.push(`26${`0014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, '0')}${chave}`.length.toString().padStart(2, '0')}0014BR.GOV.BCB.PIX01${chave.length.toString().padStart(2, '0')}${chave}`);
    payload.push("52040000"); // Merchant Category Code
    payload.push("5303986"); // Transaction Currency
    if (valor > 0) {
        payload.push(`54${valor.toFixed(2).length.toString().padStart(2, '0')}${valor.toFixed(2)}`);
    }
    payload.push("5802BR"); // Country Code
    payload.push(`59${nome.length.toString().padStart(2, '0')}${nome}`);
    payload.push(`60${cidade.length.toString().padStart(2, '0')}${cidade}`);
    payload.push(`62${`05${txid.length.toString().padStart(2, '0')}${txid}`.length.toString().padStart(2, '0')}05${txid.length.toString().padStart(2, '0')}${txid}`);
    const payloadSemCRC = payload.join("") + "6304";
    console.log("Payload sem CRC:", payloadSemCRC);
    const crc = calculateCRC16(payloadSemCRC);
    const finalPayload = payloadSemCRC + crc;
    console.log("Payload final:", finalPayload);
    return finalPayload;
}

function gerarPix() {
    console.log("Iniciando função gerarPix");
    const tipoChave = document.getElementById("tipo-chave").value;
    const chave = document.getElementById("chave-pix").value.trim();
    const valorInteiro = parseFloat(document.getElementById("valor-inteiro").value || 0);
    const valorCentavos = parseFloat(document.getElementById("valor-centavos").value || 0);
    let txid = document.getElementById("txid").value.trim().toUpperCase();
    
    console.log("Dados de entrada:", { tipoChave, chave, valorInteiro, valorCentavos, txid });

    // Validações
    if (!chave) {
        console.log("Erro: Chave PIX vazia");
        showError("Por favor, insira uma chave PIX válida");
        return;
    }
    
    console.log("Validando formato da chave para tipo:", tipoChave);
    if ((tipoChave === "cpf" && !/^\d{11}$/.test(chave)) ||
        (tipoChave === "cnpj" && !/^\d{14}$/.test(chave)) ||
        (tipoChave === "telefone" && !/^\+55\d{10,11}$/.test(chave)) ||
        (tipoChave === "email" && !/@/.test(chave))) {
        console.log("Erro: Formato inválido para chave");
        showError(`Formato inválido para chave do tipo ${tipoChave}`);
        return;
    }
    
    console.log("Validando txid");
    if (txid && !/^[A-Z0-9]{1,10}$/.test(txid)) {
        console.log("Erro: txid inválido");
        showError("O identificador deve conter apenas letras e números (máx. 10 caracteres)");
        return;
    }
    
    if (!txid) {
        txid = "PIX" + Math.random().toString(36).substr(2, 6).toUpperCase();
        document.getElementById("txid").value = txid;
        console.log("txid gerado automaticamente:", txid);
    }
    
    const valor = valorInteiro + valorCentavos / 100;
    console.log("Valor calculado:", valor);
    const payload = gerarPayload(chave, valor, txid);
    
    console.log("Iniciando geração do QR Code");
    const qrImage = document.getElementById("modalQrImage");
    const payloadText = document.getElementById("modalPayloadText");
    
    QRCode.toDataURL(payload, { 
        errorCorrectionLevel: 'M',
        margin: 2,
        color: {
            dark: document.documentElement.getAttribute('data-theme') === 'dark' ? '#F9FAFB' : '#111827',
            light: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1F2937' : '#FFFFFF'
        }
    }, (err, url) => {
        if (err) {
            console.error("Erro ao gerar QR Code:", err);
            showError("Ocorreu um erro ao gerar o QR Code");
            return;
        }
        console.log("QR Code gerado com sucesso, URL:", url);
        qrImage.src = url;
        payloadText.textContent = payload;
        console.log("Conteúdo do modal atualizado, chamando abrirModal");
        abrirModal();
    });

    console.log("Limpando mensagens de erro");
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

function copiarPayload() {
    console.log("Iniciando cópia do payload");
    const payloadText = document.getElementById("modalPayloadText").textContent;
    navigator.clipboard.writeText(payloadText).then(() => {
        console.log("Payload copiado com sucesso:", payloadText);
        tooltip.classList.add('show');
        setTimeout(() => {
            console.log("Removendo tooltip após 2 segundos");
            tooltip.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error("Erro ao copiar payload:", err);
        alert("Não foi possível copiar a chave PIX");
    });
}

function showError(message) {
    console.log("Exibindo mensagem de erro:", message);
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError() {
    console.log("Limpando mensagem de erro");
    const errorElement = document.getElementById("error-message");
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

// Verificar se a biblioteca QRCode está carregada
console.log("Verificando biblioteca QRCode:", typeof QRCode);
