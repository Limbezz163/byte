// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentUser = null;

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// ===== ИЗМЕНЕНИЕ HEADER ПРИ ПРОКРУТКЕ =====
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  }
});

// ===== ЭЛЕМЕНТЫ ДЛЯ РАБОТЫ С МОДАЛЬНЫМИ ОКНАМИ =====
const authBtn = document.getElementById("auth-icon");
const authModal = document.getElementById("auth-modal");
const accountModal = document.getElementById("account-modal");
const closeBtns = document.querySelectorAll(".close");
const tabBtns = document.querySelectorAll(".tab-btn");
const authTabs = document.querySelectorAll(".auth-tab");
const changeToRegisterBtn = document.getElementById("change-to-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");


// ===== КРАСИВОЕ УВЕДОМЛЕНИЕ =====
function showCustomAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.add("show");
  }, 100);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 300);
  }, 3000);
}

// ===== ПОКАЗ МОДАЛЬНОГО ОКНА ЛИЧНОГО КАБИНЕТА =====
function showAccountModal() {
  if (!accountModal) return;

  const userEmail = document.getElementById("user-email");
  const cartItems = document.getElementById("cart-items");

  userEmail.textContent = currentUser?.email || "Неизвестный пользователь";
  cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';

  accountModal.style.display = "block";
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
// Открытие модального окна по клику на иконку
if (authBtn) {
  authBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (currentUser) {
      showAccountModal();
    } else {
      authModal.style.display = "block";
      document.querySelector('.tab-btn[data-tab="login"]').click();
    }
  });
}

// Закрытие модальных окон
closeBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.closest(".modal").style.display = "none";
  });
});

// Закрытие при клике вне окна
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// Переключение между вкладками
if (tabBtns) {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      authTabs.forEach((tab) => tab.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

// Кнопка "Изменить данные" (переход на регистрацию)
if (changeToRegisterBtn) {
  changeToRegisterBtn.addEventListener("click", () => {
    document.querySelector('.tab-btn[data-tab="register"]').click();
  });
}

// Обработка формы входа
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    currentUser = {
      email: username,
      username: username,
    };

    authModal.style.display = "none";
    
    showCustomAlert("Вы успешно вошли!");
  });
}

// Обработка формы регистрации
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById("reg-name").value,
      surname: document.getElementById("reg-surname").value,
      patronymic: document.getElementById("reg-patronymic").value,
      phone: document.getElementById("reg-phone").value,
      email: document.getElementById("reg-email").value,
      login: document.getElementById("reg-login").value,
      password: document.getElementById("reg-password").value,
    };

    currentUser = {
      email: formData.email,
      username: formData.login,
    };

    authModal.style.display = "none";

    showCustomAlert("Регистрация прошла успешно!");
  });
}

// Переключение между меню (если есть на странице)
document.addEventListener("DOMContentLoaded", function () {
  const switchButtons = document.querySelectorAll(".menu-switch-btn");
  const menuContents = document.querySelectorAll(".menu-content");

  switchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      switchButtons.forEach((btn) => btn.classList.remove("active"));
      menuContents.forEach((content) =>
        content.classList.remove("active-content")
      );

      this.classList.add("active");
      const menuType = this.getAttribute("data-menu");
      document
        .getElementById(`${menuType}-menu`)
        .classList.add("active-content");
    });
  });


});
