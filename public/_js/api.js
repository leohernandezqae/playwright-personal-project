

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return false;
  } else {
    return token;
  }
}

export async function fetchUsers() {
  const res = await fetch("/users", {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function saveUser(user, id) {
  const url = id ? `/users/${id}` : `/users`;
  const method = id ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(user)
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function deleteUser(id) {
  return fetch(`/users/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
}

export async function fetchUser(id) {
  const res = await fetch(`/users/${id}`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  return res.json();
}