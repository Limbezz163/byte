// Плавная прокрутка при нажатии на ссылки меню
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Изменение цвета header при прокрутке
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  }
});

// Модальное окно авторизации
const authBtn = document.getElementById("auth-icon");
const authModal = document.getElementById("auth-modal");
const closeBtn = document.querySelector(".close");
const tabBtns = document.querySelectorAll(".tab-btn");
const authTabs = document.querySelectorAll(".auth-tab");
const changeToRegisterBtn = document.getElementById("change-to-register");

// Открытие модального окна по клику на иконку
if (authBtn) {
  authBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.style.display = "block";
    document.querySelector('.tab-btn[data-tab="login"]').click();
  });
}

// Закрытие модального окна
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    authModal.style.display = "none";
  });
}

// Закрытие при клике вне окна
window.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.style.display = "none";
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
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    console.log("Вход:", username, password);
    alert("Вы успешно вошли!");
    authModal.style.display = "none";
  });
}

// Обработка формы регистрации
const registerForm = document.getElementById("register-form");
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

    console.log("Регистрация:", formData);
    alert("Регистрация прошла успешно!");
    authModal.style.display = "none";
  });
}


// Переключение между меню
document.addEventListener('DOMContentLoaded', function() {
  const switchButtons = document.querySelectorAll('.menu-switch-btn');
  const menuContents = document.querySelectorAll('.menu-content');

  switchButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Удаляем активные классы
          switchButtons.forEach(btn => btn.classList.remove('active'));
          menuContents.forEach(content => content.classList.remove('active-content'));
          
          // Добавляем активный класс к выбранной кнопке
          this.classList.add('active');
          
          // Показываем соответствующее меню
          const menuType = this.getAttribute('data-menu');
          document.getElementById(`${menuType}-menu`).classList.add('active-content');
      });
  });
});

// Остальной код скрипта остается без изменений


