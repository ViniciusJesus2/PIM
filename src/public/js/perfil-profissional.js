const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userResumo = document.getElementById('userResumo');
const userLocalizacao = document.getElementById('userLocalizacao');
const userContato = document.getElementById('userContato');
const userEspecializacao = document.getElementById('userEspecializacao');
const userLinkCurriculo = document.getElementById('userLinkCurriculo');
const userRedesSociais = document.getElementById('userRedesSociais');
const userAvatar = document.getElementById('userAvatar');
const logoutButton = document.getElementById('logoutButton');
const messageDiv = document.getElementById('message');

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../login/login.html'; // Redireciona para login se não houver token
}

async function loadProfile() {
    try {
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            userName.textContent = data.user.profile.nome_completo;
            userEmail.textContent = data.user.email;
            userResumo.textContent = data.user.profile.resumo;
            userLocalizacao.textContent = data.user.profile.localizacao;
            userContato.textContent = data.user.profile.contato;
            userEspecializacao.textContent = data.user.profile.especializacao || 'Não disponível';
            userLinkCurriculo.textContent = data.user.profile.link_curriculo || 'Não disponível';
            userRedesSociais.textContent = JSON.stringify(data.user.profile.redes_sociais || 'Não disponível');
            if (data.user.profile.avatar) {
                userAvatar.src = data.user.profile.avatar;
            }

            showMessage('Perfil carregado com sucesso!', 'success');
        } else {
            showMessage('Erro ao carregar o perfil!', 'error');
            window.location.href ='../login/login.html';
        }
    } catch (error) {
        console.error('Erro ao carregar o perfil:', error);
        showMessage('Erro na comunicação com o servidor', 'error');
    }
}

function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.classList.remove('success', 'error');
    messageDiv.classList.add(type);
    messageDiv.style.display = 'block';
}

loadProfile();

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
});