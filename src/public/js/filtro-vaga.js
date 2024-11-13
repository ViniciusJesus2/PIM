// Função para buscar vagas abertas
async function buscarVagas() {
    const titulo = document.getElementById('search-input').value;
    try {
        // Adiciona o parâmetro de busca por título à URL
        const url = new URL('/api/vagas', window.location.origin);
        if (titulo) {
            url.searchParams.append('titulo', titulo); // Adiciona a pesquisa por título, se presente
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erro ao buscar vagas');
        }

        const vagas = await response.json();
        exibirVagas(vagas);
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar vagas. Por favor, tente novamente.');
    }
}

// Função para exibir as vagas na tabela
function exibirVagas(vagas) {
  const vagaList = document.getElementById('vaga-list');
  vagaList.innerHTML = '';

  if (vagas.length === 0) {
      vagaList.innerHTML = '<tr><td colspan="8">Nenhuma vaga aberta encontrada.</td></tr>';
  }

  vagas.forEach(vaga => {
      const vagaRow = document.createElement('tr');

      vagaRow.innerHTML = `
          <td>${vaga.vaga_id}</td>
          <td>${vaga.titulo}</td>
          <td>${vaga.descricao}</td>
          <td>${vaga.localizacao || 'N/A'}</td>
          <td>${vaga.salario ? `R$ ${vaga.salario}` : 'N/A'}</td>
          <td>${vaga.tipo_contrato}</td>
          <td>
              <button class="btn-candidatar" onclick="candidatarVaga(${vaga.vaga_id})">Candidatar-se</button>
              <button class="btn-detalhes" onclick="detalhesVaga(${vaga.vaga_id})">Detalhes</button>
          </td>
      `;

      vagaList.appendChild(vagaRow);
  });
}

// Função para redirecionar para a página de detalhes da vaga
function detalhesVaga(vagaId) {
  window.location.href = `/views/vaga/detalhe-vaga.html?id=${vagaId}`;
}

// Função para o candidato se candidatar a uma vaga
const candidatarVaga = async (vagaId) => {
  try {
    const response = await fetch('/api/inscricoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token
      },
      body: JSON.stringify({ vaga_id: vagaId }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    } else {
      throw new Error('Erro ao se candidatar à vaga');
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao se candidatar à vaga.');
  }
};

  
// Inicializa a busca ao carregar a página
document.addEventListener('DOMContentLoaded', buscarVagas);
