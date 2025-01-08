class UsersManager {
  constructor() {
    this.users = [];
    this.initializeElements();
    this.fetchUsers();
  }

  initializeElements() {
    // Get main elements
    this.usersContainer = document.getElementById("users-list");
    this.searchInput = document.querySelector("input[type='text']");
    this.searchInput.addEventListener("input", () => this.filterUsers());

    // Modal elements
    this.modal = document.getElementById("user-details-modal");
    
    // Only add event listener if modal exists
    if (this.modal) {
        this.modalCloseBtn = this.modal.querySelector(".modal-close");
        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener("click", () => this.closeModal());
        }
    }
  }

  async fetchUsers() {
    try {
      const response = await fetch("https://dummyjson.com/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.users = data.users;
      this.renderUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      this.usersContainer.innerHTML =
        "<tr><td colspan='4'>Error loading users</td></tr>";
    }
  }

  renderUsers(filteredUsers = this.users) {
    if (!this.usersContainer) return;

    if (filteredUsers.length === 0) {
      this.usersContainer.innerHTML =
        "<tr><td colspan='4'>No users found</td></tr>";
      return;
    }

    this.usersContainer.innerHTML = "";

    filteredUsers.forEach((user) => {
      const tr = document.createElement("tr");
      tr.classList.add("user-row");
      tr.style.cursor = "pointer";

      tr.innerHTML = `
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>
            <button class="btn-icon delete-btn" data-id="${user.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
            <button class="btn-icon view-btn" data-id="${user.id}">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `;

      // Add click event to the entire row
      tr.addEventListener("click", (e) => {
        // Don't trigger row click if clicking on delete button
        if (!e.target.closest('.delete-btn')) {
          this.viewUserDetails(user.id);
        }
      });

      // Delete button event
      const deleteButton = tr.querySelector(".delete-btn");
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent row click
        this.deleteUser(user.id);
      });

      this.usersContainer.appendChild(tr);
    });
  }

  filterUsers() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filteredUsers = this.users.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(searchTerm)
    );
    this.renderUsers(filteredUsers);
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.users = this.users.filter((user) => user.id !== userId);
        this.renderUsers();
      } else {
        throw new Error("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error while deleting user.");
    }
  }

  async viewUserDetails(userId) {
    try {
        const response = await fetch(`https://dummyjson.com/users/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        
        // Update modal content
        document.getElementById("user-details-name").textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById("user-details-email").textContent = user.email;
        document.getElementById("user-details-birthday").textContent = user.birthDate;
        document.getElementById("user-details-gender").textContent = user.gender;
        document.getElementById("user-details-age").textContent = user.age || "N/A";
        document.getElementById("user-details-phone").textContent = user.phone || "N/A";
        document.getElementById("user-details-image").src = user.image || "path/to/default-avatar.png";

        // Show modal
        if (this.modal) {
            this.modal.classList.add("active");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
  }

  showModal(user) {
    // Update modal content
    document.getElementById("user-details-name").textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("user-details-email").textContent = user.email;
    document.getElementById("user-details-birthday").textContent = user.birthDate;
    document.getElementById("user-details-gender").textContent = user.gender;
    document.getElementById("user-details-age").textContent = user.age || "N/A";
    document.getElementById("user-details-phone").textContent = user.phone || "N/A";
    document.getElementById("user-details-image").src = user.image || "path/to/default-avatar.png";

    // Show modal
    this.modal.classList.add("active");
  }

  closeModal() {
    this.modal.classList.remove("active");
  }
}

// Inicjalizowanie klasy po załadowaniu DOM
document.addEventListener("DOMContentLoaded", () => {
  new UsersManager();
});
