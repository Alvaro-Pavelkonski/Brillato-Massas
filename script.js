// =====================================================
// BRILLATO MASSAS - SCRIPT COMPLETO
// =====================================================

let carrinho = [];


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

    inicializarNavegacaoAbas();
    inicializarVerificacaoHorario();
    inicializarGeolocalizacao();
    inicializarLimitesMonteMacarrao();
    inicializarEventosCarrinho();
    atualizarExibicaoCarrinho();

});


// =====================================================
// 1. NAVEGAÇÃO DAS CATEGORIAS
// =====================================================

function inicializarNavegacaoAbas() {

    const botoesAba = document.querySelectorAll('.cat-btn');
    const secoes = document.querySelectorAll('.secao-cardapio');

    botoesAba.forEach(btn => {

        btn.addEventListener('click', () => {

            botoesAba.forEach(b =>
                b.classList.remove('active')
            );

            secoes.forEach(s =>
                s.classList.remove('active')
            );

            btn.classList.add('active');

            const targetId =
                btn.getAttribute('data-target');

            const secaoAlvo =
                document.getElementById(targetId);

            if (secaoAlvo) {
                secaoAlvo.classList.add('active');
            }

        });

    });

}


// =====================================================
// 2. HORÁRIO DE FUNCIONAMENTO
// QUINTA A DOMINGO - 19H ÀS 23H
// =====================================================

function inicializarVerificacaoHorario() {

    const statusBadge =
        document.getElementById('statusFuncionamento');

    const statusTexto =
        document.getElementById('statusTexto');

    if (!statusBadge || !statusTexto) return;


    function checarStatus() {

        const agora = new Date();

        const diaSemana = agora.getDay();
        const hora = agora.getHours();

        // Domingo = 0
        // Quinta = 4
        // Sexta = 5
        // Sábado = 6

        const diaAberto =
            [0, 4, 5, 6].includes(diaSemana);

        const horaAberto =
            hora >= 19 && hora < 23;


        if (diaAberto && horaAberto) {

            statusBadge.className =
                'status-badge aberto';

            statusTexto.textContent =
                'ABERTO AGORA';

        } else {

            statusBadge.className =
                'status-badge fechado';

            statusTexto.textContent =
                'FECHADO';

        }

    }


    checarStatus();

    setInterval(checarStatus, 60000);

}


// =====================================================
// 3. GPS
// =====================================================

function inicializarGeolocalizacao() {

    const btnGps =
        document.getElementById('btnGeolocalizacao');

    const statusGps =
        document.getElementById('statusGps');

    /*
     * O HTML precisa ter:
     *
     * <input type="hidden" id="linkGps" value="">
     */

    const inputGps =
        document.getElementById('linkGps');


    if (!btnGps) return;


    btnGps.addEventListener('click', () => {

        if (!navigator.geolocation) {

            if (statusGps) {

                statusGps.textContent =
                    'Seu navegador não suporta localização GPS.';

                statusGps.style.color =
                    '#c62828';

            }

            return;

        }


        if (statusGps) {

            statusGps.textContent =
                '📍 Buscando sua localização...';

            statusGps.style.color =
                '#6c757d';

        }


        navigator.geolocation.getCurrentPosition(

            (posicao) => {

                const latitude =
                    posicao.coords.latitude;

                const longitude =
                    posicao.coords.longitude;


                const url =
                    `https://www.google.com/maps?q=${latitude},${longitude}`;


                // Salva o link no campo escondido
                if (inputGps) {
                    inputGps.value = url;
                }


                if (statusGps) {

                    statusGps.textContent =
                        '📍 Localização capturada com sucesso!';

                    statusGps.style.color =
                        '#2e7d32';

                }

            },


            (erro) => {

                console.error(
                    'Erro ao obter localização:',
                    erro
                );


                if (statusGps) {

                    statusGps.textContent =
                        '❌ Não foi possível obter sua localização. Verifique a permissão do GPS.';

                    statusGps.style.color =
                        '#c62828';

                }

            },


            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });

}


// =====================================================
// 4. LIMITES DO MONTE SEU MACARRÃO
// =====================================================
//
// Máximo de 2 molhos
// Máximo de 8 ingredientes
// =====================================================

function inicializarLimitesMonteMacarrao() {


    // -------------------------------
    // MOLHOS
    // -------------------------------

    const molhos =
        document.querySelectorAll(
            'input[name="molho-montado"]'
        );


    molhos.forEach(molho => {

        molho.addEventListener('change', () => {

            const selecionados =
                document.querySelectorAll(
                    'input[name="molho-montado"]:checked'
                );


            if (selecionados.length >= 2) {

                molhos.forEach(item => {

                    if (!item.checked) {
                        item.disabled = true;
                    }

                });

            } else {

                molhos.forEach(item => {
                    item.disabled = false;
                });

            }

        });

    });


    // -------------------------------
    // INGREDIENTES
    // -------------------------------

    const ingredientes =
        document.querySelectorAll(
            'input[name="ingrediente"]'
        );


    ingredientes.forEach(ingrediente => {

        ingrediente.addEventListener('change', () => {

            const selecionados =
                document.querySelectorAll(
                    'input[name="ingrediente"]:checked'
                );


            if (selecionados.length >= 8) {

                ingredientes.forEach(item => {

                    if (!item.checked) {
                        item.disabled = true;
                    }

                });

            } else {

                ingredientes.forEach(item => {
                    item.disabled = false;
                });

            }

        });

    });

}


// =====================================================
// 5. EVENTOS DO CARRINHO
// =====================================================

function inicializarEventosCarrinho() {


    // =================================================
    // MASSAS PRONTAS
    // =================================================

    document
        .querySelectorAll('.btn-add-massa')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const card =
                    btn.closest('.produto-card');

                if (!card) return;


                const nome =
                    btn.getAttribute('data-nome');


                const tamanhoSelect =
                    card.querySelector('.tamanho-select');


                const massaSelect =
                    card.querySelector('.massa-select');


                if (!tamanhoSelect || !massaSelect) {
                    return;
                }


                const preco =
                    parseFloat(tamanhoSelect.value);


                const tamanhoLabel =
                    tamanhoSelect
                        .options[
                            tamanhoSelect.selectedIndex
                        ]
                        .getAttribute('data-label');


                const massaEscolhida =
                    massaSelect.value;


                adicionarAoCarrinho({

                    id:
                        `${nome}-${tamanhoLabel}-${massaEscolhida}`,

                    nome:
                        `${nome} (${tamanhoLabel})`,

                    detalhes:
                        `Massa: ${massaEscolhida}`,

                    preco:
                        preco,

                    quantidade:
                        1

                });

            });

        });


    // =================================================
    // SOBREMESAS
    // =================================================

    document
        .querySelectorAll('.btn-add-sobremesa')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const nome =
                    btn.getAttribute('data-nome');

                const preco =
                    parseFloat(
                        btn.getAttribute('data-preco')
                    );


                adicionarAoCarrinho({

                    id:
                        `sobremesa-${nome}`,

                    nome:
                        nome,

                    detalhes:
                        'Sobremesa',

                    preco:
                        preco,

                    quantidade:
                        1

                });

            });

        });


    // =================================================
    // ADICIONAIS
    // =================================================

    document
        .querySelectorAll('.btn-add-adicional')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const nome =
                    btn.getAttribute('data-nome');

                const preco =
                    parseFloat(
                        btn.getAttribute('data-preco')
                    );


                adicionarAoCarrinho({

                    id:
                        `adicional-${nome}`,

                    nome:
                        nome,

                    detalhes:
                        'Adicional',

                    preco:
                        preco,

                    quantidade:
                        1

                });

            });

        });


    // =================================================
    // BEBIDAS
    // =================================================

    document
        .querySelectorAll('.btn-add-bebida')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                const nome =
                    btn.getAttribute('data-nome');

                const preco =
                    parseFloat(
                        btn.getAttribute('data-preco')
                    );


                adicionarAoCarrinho({

                    id:
                        `bebida-${nome}`,

                    nome:
                        nome,

                    detalhes:
                        'Bebida',

                    preco:
                        preco,

                    quantidade:
                        1

                });

            });

        });


    // =================================================
    // MONTE SEU MACARRÃO
    // R$ 60,00
    // =================================================

    const btnMontar =
        document.getElementById(
            'btn-montar-macarrao'
        );


    if (btnMontar) {

        btnMontar.addEventListener('click', () => {


            const molhosSelecionados =
                Array.from(
                    document.querySelectorAll(
                        'input[name="molho-montado"]:checked'
                    )
                ).map(input => input.value);


            const ingredientesSelecionados =
                Array.from(
                    document.querySelectorAll(
                        'input[name="ingrediente"]:checked'
                    )
                ).map(input => input.value);


            // Segurança dos limites

            if (molhosSelecionados.length > 2) {

                alert(
                    'Você pode escolher no máximo 2 molhos.'
                );

                return;

            }


            if (ingredientesSelecionados.length > 8) {

                alert(
                    'Você pode escolher no máximo 8 ingredientes.'
                );

                return;

            }


            // Massa escolhida

            const massa =
                document.querySelector(
                    'input[name="massa-montada"]:checked'
                )?.value ||
                document.querySelector(
                    'select[name="massa-montada"]'
                )?.value ||
                'Não informado';


            // Talheres

            const talheres =
                document.querySelector(
                    'input[name="talheres-montado"]:checked'
                )?.value ||
                'Não informado';


            // Detalhes

            let detalhes =
                `Massa: ${massa}`;


            if (molhosSelecionados.length > 0) {

                detalhes +=
                    ` | Molhos: ${molhosSelecionados.join(', ')}`;

            }


            if (ingredientesSelecionados.length > 0) {

                detalhes +=
                    ` | Ingredientes: ${ingredientesSelecionados.join(', ')}`;

            }


            if (talheres !== 'Não informado') {

                detalhes +=
                    ` | Talheres: ${talheres}`;

            }


            adicionarAoCarrinho({

                id:
                    `monte-macarrao-${Date.now()}`,

                nome:
                    'Monte seu Macarrão',

                detalhes:
                    detalhes,

                preco:
                    60.00,

                quantidade:
                    1

            });


            // Feedback

            btnMontar.textContent =
                '✓ Adicionado ao pedido!';


            setTimeout(() => {

                btnMontar.textContent =
                    'Adicionar ao pedido • R$ 60,00';

            }, 1500);

        });

    }


    // =================================================
    // BOTÃO CARRINHO MOBILE
    // =================================================

    document
        .getElementById('btnVerCarrinhoMobile')
        ?.addEventListener('click', () => {

            document
                .getElementById('carrinho')
                ?.scrollIntoView({
                    behavior: 'smooth'
                });

        });


    // =================================================
    // FINALIZAR PEDIDO
    // =================================================

    document
        .getElementById('btnFinalizarPedido')
        ?.addEventListener(
            'click',
            abrirModalResumo
        );


    // =================================================
    // FECHAR MODAL
    // =================================================

    document
        .getElementById('btnFecharModal')
        ?.addEventListener(
            'click',
            fecharModalResumo
        );


    // =================================================
    // EDITAR PEDIDO
    // =================================================

    document
        .getElementById('btnEditarPedido')
        ?.addEventListener(
            'click',
            fecharModalResumo
        );


    // =================================================
    // CONFIRMAR PEDIDO
    // =================================================

    document
        .getElementById('btnConfirmarPedido')
        ?.addEventListener(
            'click',
            enviarPedidoWhatsApp
        );

}


// =====================================================
// 6. ADICIONAR AO CARRINHO
// =====================================================

function adicionarAoCarrinho(item) {

    const itemExistente =
        carrinho.find(
            i => i.id === item.id
        );


    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push(item);

    }


    atualizarExibicaoCarrinho();

}


// =====================================================
// 7. ALTERAR QUANTIDADE
// =====================================================

function alterarQuantidade(id, delta) {

    const item =
        carrinho.find(
            i => i.id === id
        );


    if (!item) return;


    item.quantidade += delta;


    if (item.quantidade <= 0) {

        carrinho =
            carrinho.filter(
                i => i.id !== id
            );

    }


    atualizarExibicaoCarrinho();

}


window.alterarQuantidade =
    alterarQuantidade;


// =====================================================
// 8. ATUALIZAR CARRINHO
// =====================================================

function atualizarExibicaoCarrinho() {

    const lista =
        document.getElementById(
            'listaItensCarrinho'
        );


    const valorExibicao =
        document.getElementById(
            'valorTotalExibicao'
        );


    const contadorBadges =
        document.getElementById(
            'carrinhoContadorBadges'
        );


    const barraMobile =
        document.getElementById(
            'barraFixaCarrinho'
        );


    const mobileQtd =
        document.getElementById(
            'mobileQtdItens'
        );


    const mobileValor =
        document.getElementById(
            'mobileValorTotal'
        );


    // Total de itens

    const totalItens =
        carrinho.reduce(
            (acc, item) =>
                acc + item.quantidade,
            0
        );


    // Valor total

    const valorTotal =
        carrinho.reduce(
            (acc, item) =>
                acc +
                (item.preco * item.quantidade),
            0
        );


    // Badge

    if (contadorBadges) {

        contadorBadges.textContent =
            `${totalItens} itens`;

    }


    // Valor

    if (valorExibicao) {

        valorExibicao.textContent =
            `R$ ${formatarPreco(valorTotal)}`;

    }


    // Carrinho mobile

    if (barraMobile) {

        if (totalItens > 0) {

            barraMobile.classList.remove(
                'oculto'
            );


            if (mobileQtd) {

                mobileQtd.textContent =
                    `${totalItens} ${
                        totalItens === 1
                            ? 'item'
                            : 'itens'
                    }`;

            }


            if (mobileValor) {

                mobileValor.textContent =
                    `R$ ${formatarPreco(valorTotal)}`;

            }

        } else {

            barraMobile.classList.add(
                'oculto'
            );

        }

    }


    if (!lista) return;


    // Carrinho vazio

    if (carrinho.length === 0) {

        lista.innerHTML = `

            <div class="carrinho-vazio">

                <p>
                    Seu carrinho está vazio.
                </p>

                <small>
                    Escolha itens deliciosos acima
                    para começar!
                </small>

            </div>

        `;

        return;

    }


    // Renderizar itens

    lista.innerHTML =

        carrinho.map(item => `

            <div class="item-carrinho">

                <div class="item-carrinho-info">

                    <h4>
                        ${item.nome}
                    </h4>

                    <p>
                        ${item.detalhes}
                    </p>

                    <span class="preco-tag">

                        R$
                        ${formatarPreco(
                            item.preco *
                            item.quantidade
                        )}

                    </span>

                </div>


                <div class="item-carrinho-acoes">

                    <button
                        class="btn-qtd"
                        onclick="window.alterarQuantidade('${item.id}', -1)"
                    >
                        -
                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        class="btn-qtd"
                        onclick="window.alterarQuantidade('${item.id}', 1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `).join('');

}


// =====================================================
// 9. MODAL DO PEDIDO
// =====================================================

function abrirModalResumo() {

    if (carrinho.length === 0) {

        alert(
            'Seu carrinho está vazio!'
        );

        return;

    }


    // -------------------------------
    // DADOS DO CLIENTE
    // -------------------------------

    const nome =
        document
            .getElementById('nomeCliente')
            ?.value.trim() || '';


    const telefone =
        document
            .getElementById('telefoneCliente')
            ?.value.trim() || '';


    const rua =
        document
            .getElementById('ruaCliente')
            ?.value.trim() || '';


    const numero =
        document
            .getElementById('numeroCliente')
            ?.value.trim() || '';


    const bairro =
        document
            .getElementById('bairroCliente')
            ?.value.trim() || '';


    const complemento =
        document
            .getElementById('complementoCliente')
            ?.value.trim() || '';


    const referencia =
        document
            .getElementById('referenciaCliente')
            ?.value.trim() || '';


    // -------------------------------
    // GPS
    // -------------------------------

    const gps =
        document
            .getElementById('linkGps')
            ?.value.trim() || '';


    // -------------------------------
    // OBSERVAÇÃO
    // -------------------------------

    // O seu HTML usa observacaoPedido
    const obs =
        document
            .getElementById('observacaoPedido')
            ?.value.trim() || '';


    // -------------------------------
    // TALHERES
    // -------------------------------

    const precisaTalheres =
        document.querySelector(
            'input[name="precisaTalheres"]:checked'
        )?.value || 'Não';


    // -------------------------------
    // PAGAMENTO
    // -------------------------------

    const pagamentoEl =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        );


    // -------------------------------
    // VALIDAÇÕES
    // -------------------------------

    if (!nome || !telefone) {

        alert(
            'Por favor, preencha seu nome e telefone!'
        );

        return;

    }


    if (!pagamentoEl) {

        alert(
            'Por favor, selecione uma forma de pagamento!'
        );

        return;

    }


    // -------------------------------
    // ENDEREÇO
    // -------------------------------

    const temGps =
        gps !== '';


    const temEnderecoManual =
        rua !== '' &&
        numero !== '' &&
        bairro !== '';


    if (
        !temGps &&
        !temEnderecoManual
    ) {

        alert(
            'Por favor, obtenha sua localização pelo GPS OU preencha a Rua, Número e Bairro!'
        );

        return;

    }


    // -------------------------------
    // CLIENTE NO MODAL
    // -------------------------------

    const modalNomeTel =
        document.getElementById(
            'modalNomeTel'
        );


    if (modalNomeTel) {

        modalNomeTel.innerHTML = `

            <strong>
                ${nome}
            </strong>

            (${telefone})

            <br>

            🍴
            <strong>
                Talheres descartáveis:
            </strong>

            ${precisaTalheres}

        `;

    }


    // -------------------------------
    // ENDEREÇO NO MODAL
    // -------------------------------

    let enderecoTexto = '';


    if (temGps) {

        enderecoTexto =
            '📍 Localização enviada via GPS';

    }


    if (temEnderecoManual) {

        if (enderecoTexto) {
            enderecoTexto += ' | ';
        }


        enderecoTexto +=
            `${rua}, Nº ${numero} - ${bairro}`;

    }


    if (complemento) {

        enderecoTexto +=
            ` (${complemento})`;

    }


    if (referencia) {

        enderecoTexto +=
            ` - Ref: ${referencia}`;

    }


    const modalEndereco =
        document.getElementById(
            'modalEndereco'
        );


    if (modalEndereco) {

        modalEndereco.textContent =
            enderecoTexto;

    }


    // -------------------------------
    // ITENS
    // -------------------------------

    const modalItens =
        document.getElementById(
            'modalItensLista'
        );


    if (modalItens) {

        modalItens.innerHTML =

            carrinho.map(item => `

                <p>

                    <strong>
                        ${item.quantidade}x
                        ${item.nome}
                    </strong>

                    -

                    R$
                    ${formatarPreco(
                        item.preco *
                        item.quantidade
                    )}

                    <br>

                    <small style="color:#6c757d">

                        ${item.detalhes}

                    </small>

                </p>

            `).join(`

                <hr
                    style="
                        border:0;
                        border-top:1px solid #eee;
                        margin:4px 0;
                    "
                >

            `);

    }


    // -------------------------------
    // PAGAMENTO
    // -------------------------------

    const modalPagamento =
        document.getElementById(
            'modalPagamentoInfo'
        );


    if (modalPagamento) {

        modalPagamento.textContent =
            pagamentoEl.value;

    }


    // -------------------------------
    // TOTAL
    // -------------------------------

    const total =
        carrinho.reduce(
            (acc, item) =>
                acc +
                (
                    item.preco *
                    item.quantidade
                ),
            0
        );


    const modalTotal =
        document.getElementById(
            'modalTotalValor'
        );


    if (modalTotal) {

        modalTotal.textContent =
            `R$ ${formatarPreco(total)}`;

    }


    // -------------------------------
    // ABRIR MODAL
    // -------------------------------

    document
        .getElementById('modalResumo')
        ?.classList.add('visivel');

}


// =====================================================
// 10. FECHAR MODAL
// =====================================================

function fecharModalResumo() {

    document
        .getElementById('modalResumo')
        ?.classList.remove(
            'visivel'
        );

}


// =====================================================
// 11. ENVIAR PEDIDO PARA WHATSAPP
// =====================================================

function enviarPedidoWhatsApp() {


    if (carrinho.length === 0) {

        alert(
            'Seu carrinho está vazio!'
        );

        return;

    }


    // -------------------------------
    // CLIENTE
    // -------------------------------

    const nome =
        document
            .getElementById('nomeCliente')
            ?.value.trim() || '';


    const telefone =
        document
            .getElementById('telefoneCliente')
            ?.value.trim() || '';


    // -------------------------------
    // ENDEREÇO
    // -------------------------------

    const rua =
        document
            .getElementById('ruaCliente')
            ?.value.trim() || '';


    const numero =
        document
            .getElementById('numeroCliente')
            ?.value.trim() || '';


    const bairro =
        document
            .getElementById('bairroCliente')
            ?.value.trim() || '';


    const complemento =
        document
            .getElementById('complementoCliente')
            ?.value.trim() || '';


    const referencia =
        document
            .getElementById('referenciaCliente')
            ?.value.trim() || '';


    // -------------------------------
    // OBSERVAÇÃO
    // -------------------------------

    const obs =
        document
            .getElementById('observacaoPedido')
            ?.value.trim() || '';


    // -------------------------------
    // GPS
    // -------------------------------

    const gps =
        document
            .getElementById('linkGps')
            ?.value.trim() || '';


    // -------------------------------
    // PAGAMENTO
    // -------------------------------

    const pagamento =
        document.querySelector(
            'input[name="formaPagamento"]:checked'
        )?.value ||
        'Não informado';


    // -------------------------------
    // TALHERES
    // -------------------------------

    const precisaTalheres =
        document.querySelector(
            'input[name="precisaTalheres"]:checked'
        )?.value ||
        'Não';


    // -------------------------------
    // MENSAGEM
    // -------------------------------

    let mensagem =
        `*BRILLATO MASSAS DELIVERY* 🍝\n`;

    mensagem +=
        `*NOVO PEDIDO CONFIRMADO*\n\n`;


    mensagem +=
        `👤 *Cliente:* ${nome}\n`;

    mensagem +=
        `📞 *WhatsApp:* ${telefone}\n`;

    mensagem +=
        `🍴 *Precisa de Talheres:* ${precisaTalheres}\n\n`;


    // -------------------------------
    // ENDEREÇO
    // -------------------------------

    mensagem +=
        `📍 *ENDEREÇO DE ENTREGA*\n`;


    if (gps) {

        mensagem +=
            `🗺️ *Localização GPS:* ${gps}\n`;

    }


    if (
        rua &&
        numero &&
        bairro
    ) {

        mensagem +=
            `${rua}, Nº ${numero} - ${bairro}\n`;

    }


    if (complemento) {

        mensagem +=
            `🏠 *Complemento:* ${complemento}\n`;

    }


    if (referencia) {

        mensagem +=
            `📌 *Referência:* ${referencia}\n`;

    }


    // -------------------------------
    // ITENS
    // -------------------------------

    mensagem +=
        `\n🛒 *ITENS DO PEDIDO*\n`;


    carrinho.forEach(item => {

        mensagem +=
            `• *${item.quantidade}x ${item.nome}* - R$ ${formatarPreco(
                item.preco *
                item.quantidade
            )}\n`;


        if (item.detalhes) {

            mensagem +=
                `   _${item.detalhes}_\n`;

        }

    });


    // -------------------------------
    // TOTAL
    // -------------------------------

    const total =
        carrinho.reduce(
            (acc, item) =>
                acc +
                (
                    item.preco *
                    item.quantidade
                ),
            0
        );


    mensagem +=
        `\n💰 *TOTAL:* R$ ${formatarPreco(total)}\n`;


    // -------------------------------
    // PAGAMENTO
    // -------------------------------

    mensagem +=
        `💳 *Forma de Pagamento:* ${pagamento}\n`;


    // -------------------------------
    // OBSERVAÇÃO
    // -------------------------------

    if (obs) {

        mensagem +=
            `\n📝 *Observações:* ${obs}\n`;

    }


    // -------------------------------
    // WHATSAPP
    // -------------------------------

    const numeroWhatsApp =
        '5562993431622';


    const url =
        `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;


    window.open(
        url,
        '_blank'
    );

}


// =====================================================
// 12. FORMATAÇÃO DE PREÇO
// =====================================================

function formatarPreco(valor) {

    return Number(valor)
        .toFixed(2)
        .replace('.', ',');

}