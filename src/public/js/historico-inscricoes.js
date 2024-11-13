// Função para exibir as inscrições
const exibirInscricoes = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    
    // Verifica se o user_id e token estão presentes
    if (!userId || !token) {
        alert('Usuário não autenticado!');
        return;
    }

    try {
        const token = localStorage.getItem('token');

        // Faz a requisição para a API, passando o userId no endpoint
        const response = await fetch(`/api/inscricoes/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Se a resposta não for bem-sucedida, lança um erro
        if (!response.ok) {
            throw new Error('Erro ao carregar inscrições.');
        }

        // Converte a resposta para JSON
        const inscricoes = await response.json();
        const inscricoesList = document.getElementById('inscricoes-list');
        inscricoesList.innerHTML = ''; // Limpa as inscrições existentes

        // Verifica se o usuário tem inscrições
        if (inscricoes.length === 0) {
            inscricoesList.innerHTML = '<tr><td colspan="4">Você ainda não se inscreveu em nenhuma vaga.</td></tr>';
        }

        // Exibe as inscrições
        inscricoes.forEach(inscricao => {
            const tr = document.createElement('tr');
            
            // Verifica se a vaga está finalizada ou fechada
            const podeCancelar = inscricao.status_inscricao === 'em andamento';
            const statusInscricao = inscricao.status_inscricao;
            const etapa = inscricao.etapa || 'Em análise'; // Exemplo de como exibir a etapa

            tr.innerHTML = `
                <td>${inscricao.vaga.titulo}</td>
                <td>${statusInscricao}</td>
                <td>${etapa}</td>
                <td>
                    ${podeCancelar ? `<button class="btn-cancelar" onclick="cancelarInscricao(${inscricao.inscricao_id})">Cancelar Inscrição</button>` : '<button disabled>Vaga Finalizada</button>'}
                </td>
            `;

            inscricoesList.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar inscrições.');
    }
};

// Função para cancelar a inscrição
const cancelarInscricao = async (inscricaoId) => {
    const token = localStorage.getItem('token');

    // Verifica se o token está presente
    if (!token) {
        alert('Usuário não autenticado!');
        return;
    }

    try {
        // Envia a requisição DELETE para a API para cancelar a inscrição
        const response = await fetch(`/api/inscricoes/cancelar/${inscricaoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao cancelar inscrição.');
        }

        // Recebe a resposta JSON
        const result = await response.json();
        alert(result.message); // Exibe a mensagem de sucesso
        exibirInscricoes(); // Recarrega a lista de inscrições após o cancelamento
    } catch (error) {
        console.error(error);
        alert('Erro ao cancelar inscrição.');
    }
};

// Chama a função para carregar as inscrições assim que a página for carregada
document.addEventListener('DOMContentLoaded', exibirInscricoes);
