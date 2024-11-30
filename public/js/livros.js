const livrosContainer = document.getElementById('livros');
const categoriaSelect = document.getElementById('categoria');

// Busca os livros da API
fetch('/api/livros')
    .then(res => res.json())
    .then(data => {
        categoriaSelect.addEventListener('change', () => {
            exibirLivrosPorCategoria(data, categoriaSelect.value);
        });
        // Exibe livros de uma categoria inicial
        exibirLivrosPorCategoria(data, categoriaSelect.value);
    });

    function exibirLivrosPorCategoria(data, categoria) {
        livrosContainer.innerHTML = '';
        const livrosFiltrados = data[categoria];
        
        // Verifica se existem livros na categoria selecionada
        if (!livrosFiltrados || livrosFiltrados.length === 0) {
            livrosContainer.innerHTML = '<p>Nenhum livro encontrado nessa categoria.</p>';
            return;
        }
    
        livrosFiltrados.forEach(livro => {
            const div = document.createElement('div');
            div.classList.add('card');
            div.innerHTML = `
                <img src="${livro.imagem}" alt="${livro.titulo}" class="livro-imagem" />
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>
                <p>R$ ${livro.preco.toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho(${livro.id}, '${categoria}')">Adicionar ao Carrinho</button>
            `;
            livrosContainer.appendChild(div);
        });
    }
    
    

    function adicionarAoCarrinho(id, categoria) {
        fetch('/api/carrinho', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, categoria })
        })
        .then(() => {
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.textContent = 'Livro adicionado ao carrinho!';
            mensagemSucesso.style.display = 'block';
            
            // Ocultar a mensagem automaticamente após 3 segundos
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
            }, 3000);
        })
        .catch(err => console.error('Erro:', err));
    }
    

