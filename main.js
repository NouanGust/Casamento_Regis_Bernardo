
const API_URL = 'https://presentes-casamento-backend.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do Modal
    const modal = document.getElementById('modal-aviso');
    const btnFechar = document.querySelector('.close-modal');
    const btnIrLoja = document.getElementById('btn-ir-loja');

    // 1. Carregar o estado atual dos presentes ao abrir a página
    fetch(`${API_URL}/presentes`)
        .then(response => response.json())
        .then(data => {
            data.forEach(presente => {
                if (presente.confirmado) {
                    const card = document.querySelector(`.card[data-id="${presente.id}"]`);
                    if (card) {
                        card.classList.add('confirmado');
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar presentes da API:', error));

    // 2. Lógica para ABRIR o modal ao clicar em "Presentear"
    document.querySelectorAll('.card .btn-presentear').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que a página recarregue
            
            // Pega o link específico do produto no botão
            const linkDaLoja = botao.getAttribute('data-link'); 
            
            if (modal && btnIrLoja) {
                btnIrLoja.href = linkDaLoja; // Adiciona o link no botão de confirmar do modal
                modal.style.display = 'flex'; // Exibe o modal
            } else {
                console.error('Modal ou botão do modal não encontrados no HTML.');
            }
        });
    });

    // 3. Lógica para FECHAR o modal
    const fecharModal = () => {
        if (modal) modal.style.display = 'none';
    };

    if (btnFechar) btnFechar.addEventListener('click', fecharModal);
    if (btnIrLoja) btnIrLoja.addEventListener('click', fecharModal);
    
    // Fecha se clicar fora da caixinha do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // 4. Lógica para CONFIRMAR o presente no Banco de Dados
    document.querySelectorAll('.btn-confirmar').forEach(botao => {
        botao.addEventListener('click', async (e) => {
            const card = e.target.closest('.card');
            const presenteId = card.getAttribute('data-id'); 
            
            const textoOriginal = botao.innerText;
            botao.innerText = 'Confirmando...';
            botao.disabled = true;

            try {
                const response = await fetch(`${API_URL}/presentes/${presenteId}/confirmar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    card.classList.add('confirmado');
                } else {
                    alert('Este presente já foi confirmado por outro convidado.');
                    botao.innerText = textoOriginal;
                    botao.disabled = false;
                }
            } catch (error) {
                alert('Erro de conexão. Verifique sua internet e tente novamente.');
                botao.innerText = textoOriginal;
                botao.disabled = false;
            }
        });
    });
});
