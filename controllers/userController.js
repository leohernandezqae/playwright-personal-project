const User = require("../models").User;

exports.createUser = async (req, res) => {
  try {
    const { cpf } = req.body;

    // Validate CPF
    if (!isValidCPF(cpf)) {
      return res.status(400).json({ message: "Invalid CPF" });
    }

    // Check if document already exists
    const isCpfFound = await User.findOne({ Where: { cpf: `${cpf}` } });
    console.log(isCpfFound);
    if (isCpfFound) {
      return res
        .status(404)
        .json({ message: `Document ${maskCPF(cpf)} already exists.` });
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not founds" });
    }

    await user.update(req.body);
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();
  res.status(204).end();
};

function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // remove non-digit characters
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0,
    rest;

  // Validate first check digit
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[9])) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf[10])) return false;

  return true;
}

function maskCPF(value) {
  if (!value) return "";
  return value
    .replace(/\D/g, "") // keep only digits
    .replace(/(\d{3})(\d)/, "$1.$2") // 000.000
    .replace(/(\d{3})(\d)/, "$1.$2") // 000.000.000
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // 000.000.000-00
}
