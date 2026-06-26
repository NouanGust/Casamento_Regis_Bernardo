
const API_URL = 'https://presentes-casamento-backend.onrender.com';

    document.addEventListener('DOMContentLoaded', () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        
        const modal = document.getElementById('modal-aviso');
        const btnFechar = document.querySelector('.close-modal');
        const btnIrLoja = document.getElementById('btn-ir-loja');

        fetch(`${API_URL}/presentes`)
            .then(response => {
                if (!response.ok) throw new Error('Falha na resposta do servidor');
                return response.json();
            })
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
            .catch(error => {
                console.error('Erro ao carregar presentes da API:', error);
            })
            .finally(() => {
                loadingOverlay.classList.add('escondido');
            });
    document.querySelectorAll('.card .btn-presentear').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const linkDaLoja = botao.getAttribute('data-link'); 
            
            if (modal && btnIrLoja) {
                btnIrLoja.href = linkDaLoja; 
                modal.style.display = 'flex'; 
            } else {
                console.error('Modal ou botão do modal não encontrados no HTML.');
            }
        });
    });

    const fecharModal = () => {
        if (modal) modal.style.display = 'none';
    };

    if (btnFechar) btnFechar.addEventListener('click', fecharModal);
    if (btnIrLoja) btnIrLoja.addEventListener('click', fecharModal);
    

    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });


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
