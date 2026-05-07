// app.js
const express = require('express');
const app = express();

app.use(express.json());

// ======================
// Dados em memória
// ======================
let filmes = [];
let usuarios = [];
let favoritos = [];

// Contadores de ID
let filmeIdCounter = 1;
let usuarioIdCounter = 1;

// ======================
// Rotas de Filmes
// ======================

// Listar todos os filmes
app.get('/filmes', (req, res) => {
    res.json(filmes);
});

// Cadastrar um novo filme
app.post('/filmes', (req, res) => {
    const { titulo, diretor, ano, genero } = req.body;
    if (!titulo || !diretor || !ano || !genero) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    const novoFilme = {
        id: filmeIdCounter++,
        titulo,
        diretor,
        ano,
        genero
    };
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

// Remover um filme
app.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = filmes.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Filme não encontrado" });
    }
    filmes.splice(index, 1);
    // Também remover dos favoritos
    favoritos = favoritos.filter(f => f.id_filme !== id);
    res.json({ message: "Filme removido com sucesso" });
});

// ======================
// Rotas de Usuários
// ======================

// Listar todos os usuários
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// Cadastrar um novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, plano } = req.body;
    if (!nome || !email || !plano) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    const novoUsuario = {
        id: usuarioIdCounter++,
        nome,
        email,
        plano
    };
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { nome, email, plano } = req.body;
    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (plano) usuario.plano = plano;

    res.json(usuario);
});

// ======================
// Rotas de Favoritos
// ======================

// Adicionar favorito
app.post('/favoritos', (req, res) => {
    const { id_usuario, id_filme } = req.body;
    const usuario = usuarios.find(u => u.id === id_usuario);
    const filme = filmes.find(f => f.id === id_filme);

    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    if (!filme) return res.status(404).json({ error: "Filme não encontrado" });

    // Verificar se já está favoritado
    const jaFavorito = favoritos.some(f => f.id_usuario === id_usuario && f.id_filme === id_filme);
    if (jaFavorito) return res.status(400).json({ error: "Filme já está nos favoritos do usuário" });

    const novoFavorito = { id_usuario, id_filme };
    favoritos.push(novoFavorito);
    res.status(201).json(novoFavorito);
});

// Listar todos os favoritos
app.get('/favoritos', (req, res) => {
    res.json(favoritos);
});

// Listar favoritos de um usuário específico
app.get('/favoritos/usuario/:id_usuario', (req, res) => {
    const id_usuario = parseInt(req.params.id_usuario);
    const usuario = usuarios.find(u => u.id === id_usuario);
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const filmesFavoritos = favoritos
        .filter(f => f.id_usuario === id_usuario)
        .map(f => filmes.find(filme => filme.id === f.id_filme));

    res.json(filmesFavoritos);
});

// ======================
// Iniciar servidor
// ======================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
