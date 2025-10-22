import { fetchUsers, fetchUser, saveUser, deleteUser } from "./api.js";
import { renderTable, showModal } from "./ui.js";
import { checkAuth } from './auth.js';

checkAuth(); // redirects if token missing or expired
const userForm = document.getElementById("userForm");
const searchInput = document.getElementById("searchInput");
const editModal = new bootstrap.Modal(document.getElementById("editUserModal"));

let usersData = [];

// -------------------- Load Users --------------------
export async function loadUsers() {
  usersData = await fetchUsers();
  renderTable(usersData, openEditModal, handleDelete);
}

// -------------------- Add User --------------------
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    birthDate: document.getElementById("birthDate").value,
    occupation: document.getElementById("occupation").value,
    salary: parseFloat(document.getElementById("salary").value.replace(/\D/g, "")) / 100
  };

  const { ok, data } = await saveUser(user);
  if (!ok) return showModal(data.message, "danger");

  showModal("User added successfully!", "success");
  userForm.reset();
  loadUsers();
});

// -------------------- Edit User Modal --------------------
export async function openEditModal(id) {
  const user = await fetchUser(id);
  document.getElementById("editId").value = user.id;
  document.getElementById("editFirstName").value = user.firstName;
  document.getElementById("editLastName").value = user.lastName;
  document.getElementById("editBirthDate").value = user.birthDate.split("T")[0];
  document.getElementById("editOccupation").value = user.occupation;
  document.getElementById("editSalary").value = user.salary.toFixed(2);
  editModal.show();
}

// -------------------- Save Edit --------------------
document.getElementById("saveEdit").addEventListener("click", async () => {
  const id = document.getElementById("editId").value;
  const updatedUser = {
    firstName: document.getElementById("editFirstName").value,
    lastName: document.getElementById("editLastName").value,
    birthDate: document.getElementById("editBirthDate").value,
    occupation: document.getElementById("editOccupation").value,
    salary: parseFloat(document.getElementById("editSalary").value.replace(/\D/g, "")) / 100
  };

  const { ok, data } = await saveUser(updatedUser, id);
  if (!ok) return showModal(data.message, "danger");

  showModal("User updated successfully!", "success");
  editModal.hide();
  loadUsers();
});

// -------------------- Delete User --------------------
const deleteModalEl = document.getElementById("deleteUserModal");
const deleteModal = new bootstrap.Modal(deleteModalEl);

export async function handleDelete(id) {
  const user = await fetchUser(id);
  document.getElementById("deleteId").value = user.id;
  document.getElementById("deleteUserName").textContent = `${user.firstName} ${user.lastName}`;
  deleteModal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  const id = document.getElementById("deleteId").value;
  const { ok, data } = await deleteUser(id);

  if (!ok) {
    showModal(data.message, "danger");
    return;
  }

  showModal("User deleted successfully!", "success");
  deleteModal.hide();
  loadUsers(); // refresh the user table
});

// -------------------- Search --------------------
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  const filtered = usersData.filter(u =>
    u.firstName.toLowerCase().includes(filter) ||
    u.lastName.toLowerCase().includes(filter) ||
    u.occupation.toLowerCase().includes(filter) ||
    u.cpf.includes(filter)
  );
  renderTable(filtered, openEditModal, handleDelete);
});

// -------------------- Initialize --------------------
loadUsers();
