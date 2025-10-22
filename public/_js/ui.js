export function maskCPF(cpf) {
  if (!cpf) return "";
  cpf = cpf.replace(/\D/g, "").padEnd(11, "0").slice(0, 11);
  return cpf.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatMoney(val) {
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function showModal(message, type = "info") {
  const modalTitle = document.getElementById("alertModalTitle");
  const modalBody = document.getElementById("alertModalBody");

  switch (type) {
    case "success": modalTitle.textContent = "✅ Success"; break;
    case "danger": modalTitle.textContent = "⚠️ Error"; break;
    case "warning": modalTitle.textContent = "⚠️ Warning"; break;
    default: modalTitle.textContent = "ℹ️ Info";
  }

  modalBody.textContent = message;
  const modal = new bootstrap.Modal(document.getElementById("alertModal"));
  modal.show();
}

export function renderTable(users, editUser, deleteUser) {
  const tbody = document.getElementById("userTable");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${maskCPF(user.cpf)}</td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${formatDate(user.birthDate)}</td>
      <td>${user.occupation}</td>
      <td>${formatMoney(user.salary)}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;

    tr.querySelector(".btn-warning").addEventListener("click", () => editUser(user.id));
    tr.querySelector(".btn-danger").addEventListener("click", () => deleteUser(user.id));

    tbody.appendChild(tr);
  });
}
