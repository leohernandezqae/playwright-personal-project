export function setupSorting(usersData, renderCallback) {
  let currentSortField = null;
  let sortAsc = true;

  document.querySelectorAll("th[data-field]").forEach(th => {
    th.addEventListener("click", () => {
      const field = th.getAttribute("data-field");

      if (currentSortField === field) {
        sortAsc = !sortAsc;
      } else {
        currentSortField = field;
        sortAsc = true;
      }

      const sorted = [...usersData].sort((a, b) => {
        let valA, valB;

        if (field === "name") {
          valA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valB = `${b.firstName} ${b.lastName}`.toLowerCase();
        } else if (field === "birthDate") {
          valA = new Date(a.birthDate);
          valB = new Date(b.birthDate);
        } else {
          valA = a[field];
          valB = b[field];
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });

      renderCallback(sorted);
    });
  });
}
