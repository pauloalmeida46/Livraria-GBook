const carrinhoContainer = document.getElementById('carrinho');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const mensagem = document.getElementById('mensagem');
const valorTotalContainer = document.getElementById('valor-total'); // Adicionando o contêiner para mostrar o valor total

function carregarCarrinho() {
    fetch('/api/carrinho')
        .then(res => res.json())
        .then(data => {
            carrinhoContainer.innerHTML = '';
            if (data.length === 0) {
                carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
                finalizarCompraBtn.style.display = 'none';
                valorTotalContainer.style.display = 'none'; // Esconder o total se o carrinho estiver vazio
                return;
            }
            finalizarCompraBtn.style.display = 'block';
            valorTotalContainer.style.display = 'block'; // Mostrar o total

            let total = 0; // Inicializando o total

            // Criar a tabela de carrinho
            let tabela = `
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Preço</th>
                            <th>Categoria</th>
                            <th>Remover</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Adicionar os itens à tabela e calcular o total
            data.forEach(item => {
                total += item.preco; // Somar o preço de cada item ao total
                tabela += `
                    <tr>
                        <td>${item.titulo}</td>
                        <td>${item.autor}</td>
                        <td>R$ ${item.preco.toFixed(2)}</td>
                        <td>${item.categoria}</td> <!-- Categoria aqui -->
                        <td><button onclick="removerDoCarrinho(${item.id})">Remover</button></td>
                    </tr>
                `;
            });

            tabela += `
                    </tbody>
                </table>
            `;

            // Atualizar a tabela no carrinho
            carrinhoContainer.innerHTML = tabela;

            // Exibir o valor total formatado
            valorTotalContainer.innerHTML = `Total: R$ ${total.toFixed(2)}`;
        })
        .catch(err => console.error('Erro ao carregar carrinho:', err));
}

// Finalizar a compra
finalizarCompraBtn.addEventListener('click', () => {
    fetch('/api/carrinho/finalizar', { method: 'POST' })
        .then(res => {
            if (res.ok) {
                mensagem.textContent = 'Compra finalizada com sucesso!';
                mensagem.style.color = 'green';
                carregarCarrinho(); // Atualizar o carrinho (agora vazio)
            } else {
                mensagem.textContent = 'Erro ao finalizar a compra.';
                mensagem.style.color = 'red';
            }
        })
        .catch(err => {
            mensagem.textContent = 'Erro ao processar a solicitação.';
            mensagem.style.color = 'red';
            console.error('Erro ao finalizar compra:', err);
        });
});

// Remover item do carrinho
function removerDoCarrinho(id) {
    fetch(`/api/carrinho/${id}`, { method: 'DELETE' })
        .then(() => carregarCarrinho())
        .catch(err => console.error('Erro ao remover item do carrinho:', err));
}

// Carregar os itens ao abrir a página
carregarCarrinho();
