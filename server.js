const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importa os dados dos livros
const livros = require('./data/livrosData');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

// Banco de dados simples para o carrinho
let carrinho = [];

// Rotas da API
app.get('/api/livros', (req, res) => res.json(livros));
app.get('/api/carrinho', (req, res) => res.json(carrinho));
app.post('/api/carrinho', (req, res) => {
    const { id, categoria } = req.body;

    if (!livros[categoria]) {
        return res.status(400).send({ error: 'Categoria inválida' });
    }

    const livro = livros[categoria].find(l => l.id === id);
    if (livro) {
        // Adicionar a categoria ao livro antes de armazenar no carrinho
        const livroComCategoria = {
            ...livro,
            categoria: categoria  // Inclui a categoria
        };
        carrinho.push(livroComCategoria);
        res.status(201).json(carrinho);
    } else {
        res.status(404).send({ error: 'Livro não encontrado na categoria' });
    }
});


app.delete('/api/carrinho/:id', (req, res) => {
    const { id } = req.params;
    carrinho = carrinho.filter(l => l.id != id);
    res.status(204).send();
});

app.post('/api/carrinho/finalizar', (req, res) => {
    if (carrinho.length > 0) {
        console.log('Compra finalizada:', carrinho);

        carrinho = [];
        res.status(200).send({ message: 'Compra finalizada com sucesso!' });
    } else {
        res.status(400).send({ error: 'Carrinho está vazio!' });
    }
});

// Página inicial redireciona para livros.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/livros.html');
});

// Inicia o servidor
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
