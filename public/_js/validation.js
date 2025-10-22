export function maskCPF(cpf) {
  if (!cpf) return "";
  cpf = cpf.replace(/\D/g, "").slice(0, 11);
  return cpf.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

export function formatMoney(val) {
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
