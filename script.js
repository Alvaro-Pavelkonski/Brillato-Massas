// ESTADO GLOBAL DO CARRINHO
let carrinho = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacaoAbas();
    inicializarVerificacaoHorario();
    inicializarGeolocalizacao();
    inicializarEventosCarrinho();
    atualizarExibicaoCarrinho();
});

// 1. NAVEGAÇÃO DE CATEGORIAS (ABAS)
function inicializarNavegacaoAbas() {
    const botoesAba = document.querySelectorAll('.cat-btn');
    const secoes = document.querySelectorAll('.secao-cardapio');

    botoesAba.forEach(btn => {
        btn.addEventListener('click', () => {
            botoesAba.forEach(b => b.classList.remove('active'));
            secoes.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// 2. STATUS DE FUNCIONAMENTO (Quinta a Domingo, 19h às 23h)
function inicializarVerificacaoHorario() {
    const statusBadge = document.getElementById('statusFuncionamento');
    const statusTexto = document.getElementById('statusTexto');

    function checarStatus() {
        const agora = new Date();
        const diaSemana = agora.getDay(); // 0 = Domingo, 4 = Quinta, 5 = Sexta, 6 = Sábado
        const hora = agora.getHours();

        const diaAberto = [0, 4, 5, 6].includes(diaSemana);
        const horaAberto = hora >= 19 && hora < 23;

        if (diaAberto && horaAberto) {
            statusBadge.className = 'status-badge aberto';
            statusTexto.textContent = 'ABERTO AGORA';
        } else {
            statusBadge.className = 'status-badge fechado';
            statusTexto.textContent = 'FECHADO';
        }
    }

    checarStatus();
    setInterval(checarStatus, 60000);
}

// 3. CAPTURA DE GPS
function inicializarGeolocalizacao() {
    const btnGps = document.getElementById('btnGeolocalizacao');
    const statusGps = document.getElementById('statusGps');
    const inputGps = document.getElementById('linkGps');

    if (!btnGps) return;

    btnGps.addEventListener('click', () => {
        if (!navigator.geolocation) {
            statusGps.textContent = 'Navegador não suporta geolocalização.';
            statusGps.style.color = '#c62828';
            return;
        }

        statusGps.textContent = 'Buscando sua localização...';
        statusGps.style.color = '#6c757d';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const url = `https://www.google.com/maps?q=${lat},${lng}`;
                inputGps.value = url;
                statusGps.textContent = '📍 Localização capturada com sucesso!';
                statusGps.style.color = '#2e7d32';
            },
            () => {
                statusGps.textContent = 'Não foi possível obter a localização automaticamente.';
                statusGps.style.color = '#c62828';
            },
            { enableHighAccuracy: true }
        );
    });
}

// 4. EVENTOS DE ADIÇÃO AO CARRINHO
function inicializarEventosCarrinho() {
    // Adicionar Massa Pronta
    document.querySelectorAll('.btn-add-massa').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.produto-card');
            const nome = btn.getAttribute('data-nome');
            const tamanhoSelect = card.querySelector('.tamanho-select');
            const massaSelect = card.querySelector('.massa-select');

            const preco = parseFloat(tamanhoSelect.value);
            const tamanhoLabel = tamanhoSelect.options[tamanhoSelect.selectedIndex].getAttribute('data-label');
            const massaEscolhida = massaSelect.value;

            adicionarAoCarrinho({
                id: `${nome}-${tamanhoLabel}-${massaEscolhida}`,
                nome: `${nome} (${tamanhoLabel})`,
                detalhes: `Massa: ${massaEscolhida}`,
                preco: preco,
                quantidade: 1
            });
        });
    });

    // Adicionar Monte seu Macarrão
    const btnMonte = document.getElementById('btn-montar-macarrao');
    if (btnMonte) {
        btnMonte.addEventListener('click', () => {
            const form = document.getElementById('formMonteMacarrao');
            const massa = form.querySelector('input[name="massa-montada"]:checked')?.value;
            
            const molhos = Array.from(form.querySelectorAll('input[name="molho-montado"]:checked')).map(cb => cb.value);
            const temperos = Array.from(form.querySelectorAll('input[name="tempero-montado"]:checked')).map(cb => cb.value);
            const ingredientes = Array.from(form.querySelectorAll('input[name="ingrediente"]:checked')).map(cb => cb.value);

            if (!massa) {
                alert('Por favor, escolha o tipo de massa!');
                return;
            }

            let detalhes = [`Massa: ${massa}`];
            if (molhos.length) detalhes.push(`Molhos: ${molhos.join(', ')}`);
            if (temperos.length) detalhes.push(`Temperos: ${temperos.join(', ')}`);
            if (ingredientes.length) detalhes.push(`Ingredientes: ${ingredientes.join(', ')}`);

            adicionarAoCarrinho({
                id: `monte-${Date.now()}`,
                nome: 'Monte seu Macarrão',
                detalhes: detalhes.join(' | '),
                preco: 48.00,
                quantidade: 1
            });

            form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
    }

    // Adicionar Adicionais Extras
    document.querySelectorAll('.btn-add-adicional').forEach(btn => {
        btn.addEventListener('click', () => {
            const nome = btn.getAttribute('data-nome');
            const preco = parseFloat(btn.getAttribute('data-preco'));

            adicionarAoCarrinho({
                id: `adic-${nome}`,
                nome: nome,
                detalhes: 'Adicional Extra',
                preco: preco,
                quantidade: 1
            });
        });
    });

    // Adicionar Bebidas
    document.querySelectorAll('.btn-add-bebida').forEach(btn => {
        btn.addEventListener('click', () => {
            const nome = btn.getAttribute('data-nome');
            const preco = parseFloat(btn.getAttribute('data-preco'));

            adicionarAoCarrinho({
                id: `bebida-${nome}`,
                nome: nome,
                detalhes: 'Bebida',
                preco: preco,
                quantidade: 1
            });
        });
    });

    // Navegação Mobile
    document.getElementById('btnVerCarrinhoMobile')?.addEventListener('click', () => {
        document.getElementById('carrinho').scrollIntoView({ behavior: 'smooth' });
    });

    // Modal e Finalização
    document.getElementById('btnFinalizarPedido')?.addEventListener('click', abrirModalResumo);
    document.getElementById('btnFecharModal')?.addEventListener('click', fecharModalResumo);
    document.getElementById('btnEditarPedido')?.addEventListener('click', fecharModalResumo);
    document.getElementById('btnConfirmarPedido')?.addEventListener('click', enviarPedidoWhatsApp);
}

// 5. GERENCIAMENTO DO CARRINHO
function adicionarAoCarrinho(item) {
    const itemExistente = carrinho.find(i => i.id === item.id);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push(item);
    }
    atualizarExibicaoCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(i => i.id !== id);
    }
    atualizarExibicaoCarrinho();
}

function atualizarExibicaoCarrinho() {
    const lista = document.getElementById('listaItensCarrinho');
    const valorExibicao = document.getElementById('valorTotalExibicao');
    const contadorBadges = document.getElementById('carrinhoContadorBadges');
    const barraMobile = document.getElementById('barraFixaCarrinho');
    const mobileQtd = document.getElementById('mobileQtdItens');
    const mobileValor = document.getElementById('mobileValorTotal');

    const totalItens = carrinho.reduce((acc, cur) => acc + cur.quantidade, 0);
    const valorTotal = carrinho.reduce((acc, cur) => acc + (cur.preco * cur.quantidade), 0);

    contadorBadges.textContent = `${totalItens} itens`;
    valorExibicao.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    if (totalItens > 0) {
        barraMobile.classList.remove('oculto');
        mobileQtd.textContent = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
        mobileValor.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    } else {
        barraMobile.classList.add('oculto');
    }

    if (carrinho.length === 0) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <p>Seu carrinho está vazio.</p>
                <small>Escolha itens deliciosos acima para começar!</small>
            </div>`;
        return;
    }

    lista.innerHTML = carrinho.map(item => `
        <div class="item-carrinho">
            <div class="item-carrinho-info">
                <h4>${item.nome}</h4>
                <p>${item.detalhes}</p>
                <span class="preco-tag">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="item-carrinho-acoes">
                <button class="btn-qtd" onclick="alterarQuantidade('${item.id}', -1)">-</button>
                <span>${item.quantidade}</span>
                <button class="btn-qtd" onclick="alterarQuantidade('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

// 6. MODAL E ENVIO WHATSAPP (COM GPS OPCIONAL)
function abrirModalResumo() {
    const nome = document.getElementById('nomeCliente').value.trim();
    const telefone = document.getElementById('telefoneCliente').value.trim();
    const rua = document.getElementById('ruaCliente').value.trim();
    const numero = document.getElementById('numeroCliente').value.trim();
    const bairro = document.getElementById('bairroCliente').value.trim();
    const gps = document.getElementById('linkGps').value;

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    if (!nome || !telefone) {
        alert('Por favor, preencha seu nome e telefone!');
        return;
    }

    const temGps = gps.length > 0;
    const temEnderecoManual = rua.length > 0 && numero.length > 0 && bairro.length > 0;

    if (!temGps && !temEnderecoManual) {
        alert('Por favor, obtenha sua localização pelo GPS OU preencha a Rua, Número e Bairro!');
        return;
    }

    document.getElementById('modalNomeTel').textContent = `${nome} (${telefone})`;
    
    let endTxt = "";
    if (temGps) {
        endTxt += "📍 Localização enviada via GPS";
    }
    
    if (temEnderecoManual) {
        if (endTxt) endTxt += " | ";
        endTxt += `${rua}, Nº ${numero} - ${bairro}`;
    }

    const comp = document.getElementById('complementoCliente').value.trim();
    const ref = document.getElementById('referenciaCliente').value.trim();

    if (comp) endTxt += ` (${comp})`;
    if (ref) endTxt += ` - Ref: ${ref}`;

    document.getElementById('modalEndereco').textContent = endTxt;

    const modalItens = document.getElementById('modalItensLista');
    modalItens.innerHTML = carrinho.map(i => `
        <p><strong>${i.quantidade}x ${i.nome}</strong> - R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}<br>
        <small style="color:#6c757d">${i.detalhes}</small></p>
    `).join('<hr style="border:0; border-top:1px solid #eee; margin:4px 0;">');

    const pagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
    document.getElementById('modalPagamentoInfo').textContent = pagamento;

    const valorTotal = carrinho.reduce((acc, cur) => acc + (cur.preco * cur.quantidade), 0);
    document.getElementById('modalTotalValor').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    document.getElementById('modalResumo').classList.add('visivel');
}

function fecharModalResumo() {
    document.getElementById('modalResumo').classList.remove('visivel');
}

function enviarPedidoWhatsApp() {
    const nome = document.getElementById('nomeCliente').value.trim();
    const telefone = document.getElementById('telefoneCliente').value.trim();
    const rua = document.getElementById('ruaCliente').value.trim();
    const numero = document.getElementById('numeroCliente').value.trim();
    const bairro = document.getElementById('bairroCliente').value.trim();
    const comp = document.getElementById('complementoCliente').value.trim();
    const ref = document.getElementById('referenciaCliente').value.trim();
    const obs = document.getElementById('observacaoCliente').value.trim();
    const gps = document.getElementById('linkGps').value;
    const pagamento = document.querySelector('input[name="formaPagamento"]:checked').value;

    let msg = `*BRILLATO MASSAS* 🍝\n`;
    msg += `*Novo Pedido Confirmado*\n\n`;
    msg += `👤 *Cliente:* ${nome}\n`;
    msg += `📞 *WhatsApp:* ${telefone}\n\n`;

    msg += `📍 *Endereço de Entrega:*\n`;
    
    if (gps) {
        msg += `🗺️ *Localização GPS:* ${gps}\n`;
    }

    if (rua && numero && bairro) {
        msg += `${rua}, Nº ${numero} - ${bairro}\n`;
    }

    if (comp) msg += `Comp: ${comp}\n`;
    if (ref) msg += `Ref: ${ref}\n`;

    msg += `\n🛒 *Itens do Pedido:*\n`;
    carrinho.forEach(i => {
        msg += `• *${i.quantidade}x ${i.nome}* - R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}\n`;
        if (i.detalhes) msg += `   _${i.detalhes}_\n`;
    });

    const total = carrinho.reduce((acc, cur) => acc + (cur.preco * cur.quantidade), 0);
    msg += `\n💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
    msg += `💳 *Forma de Pagamento:* ${pagamento}\n`;

    if (obs) {
        msg += `\n📝 *Observações:* ${obs}\n`;
    }

    const numeroWhatsApp = "5562993431622"; // Insira aqui o número real do restaurante
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
}