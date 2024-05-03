function validarDadosDoCadastroDoUsuario(req, res, next) {
  const { nome, email, senha } = req.body;

  if (!nome?.trim()) {
    return res.status(400).json({ mensagem: "O nome é obrigatório" });
  }
  if (!email?.trim()) {
    return res.status(400).json({ mensagem: "O email é obrigatório" });
  }
  if (!senha?.trim()) {
    return res.status(400).json({ mensagem: "A senha é obrigatória" });
  }

  next();
}

module.exports = { validarDadosDoCadastroDoUsuario };
