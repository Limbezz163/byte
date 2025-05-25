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

// ===== ФУНКЦИИ ДЛЯ ПРОВЕРКИ ВАЛИДАЦИИ =====
function validateLength(value, min, max, fieldName) {
  if (!value) return `${fieldName} обязателен для заполнения`;
  if (value.length < min) {
    return `${fieldName} должен содержать минимум ${min} символов`;
  }
  if (value.length > max) {
    return `${fieldName} должен содержать максимум ${max} символов`;
  }
  return null;
}

function validateName(value, fieldName) {
  if (/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return `${fieldName} должен содержать только буквы`;
  }
  return null;
}

function validatePhone(value) {
  if (!/^[\d\s()+-\s]+$/.test(value)) {
    return "Телефон должен содержать только цифры и символы +-()";
  }
  return null;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return "Введите корректный email адрес";
  }
  return null;
}

function showError(inputElement, message) {
  const formGroup = inputElement.closest(".form-group");
  let errorElement = formGroup.querySelector(".error-message");

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    formGroup.appendChild(errorElement);
  }

  errorElement.textContent = message;
  inputElement.classList.add("invalid");
}

function clearError(inputElement) {
  const formGroup = inputElement.closest(".form-group");
  const errorElement = formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.remove();
  }

  inputElement.classList.remove("invalid");
}

// ===== КРАСИВОЕ УВЕДОМЛЕНИЕ =====
function showCustomAlert(message, isSuccess = true) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `custom-alert ${isSuccess ? "" : "error"}`;
  alertDiv.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="${
        isSuccess
          ? "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
          : "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      }"/>
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
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Проверка длины логина и пароля
    const loginError = validateLength(username, 4, 10, "Логин");
    const passwordError = validateLength(password, 4, 10, "Пароль");

    if (loginError) {
      showError(document.getElementById("login-username"), loginError);
      return;
    }

    if (passwordError) {
      showError(document.getElementById("login-password"), passwordError);
      return;
    }

    currentUser = {
      email: username,
      username: username,
    };

    authModal.style.display = "none";
    
    showCustomAlert("Вы успешно вошли!");
  });

  // Очистка ошибок при вводе
  loginForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      clearError(this);
    });
  });
}

// Обработка формы регистрации
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let hasErrors = false;

    // Получаем значения полей
    const formData = {
      name: document.getElementById("reg-name").value.trim(),
      surname: document.getElementById("reg-surname").value.trim(),
      patronymic: document.getElementById("reg-patronymic").value.trim(),
      phone: document.getElementById("reg-phone").value.trim(),
      email: document.getElementById("reg-email").value.trim(),
      login: document.getElementById("reg-login").value.trim(),
      password: document.getElementById("reg-password").value.trim(),
    };

    // Очищаем предыдущие ошибки
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document.querySelectorAll(".form-group input").forEach((input) => {
      input.classList.remove("invalid");
    });

    // Проверка полей
    const errors = {
      name:
        validateLength(formData.name, 3, 15, "Имя") ||
        validateName(formData.name, "Имя"),
      surname:
        validateLength(formData.surname, 3, 20, "Фамилия") ||
        validateName(formData.surname, "Фамилия"),
      patronymic: formData.patronymic
        ? validateLength(formData.patronymic, 6, 20, "Отчество") ||
          validateName(formData.patronymic, "Отчество")
        : null,
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      login: validateLength(formData.login, 4, 10, "Логин"),
      password: validateLength(formData.password, 4, 10, "Пароль"),
    };

    // Показываем ошибки
    Object.keys(errors).forEach((field) => {
      if (errors[field]) {
        showError(document.getElementById(`reg-${field}`), errors[field]);
        hasErrors = true;
      }
    });

    // Если есть ошибки - прерываем отправку формы
    if (hasErrors) {
      showCustomAlert("Пожалуйста, исправьте ошибки в форме", false);
      return;
    }

    // Если проверки пройдены
    currentUser = {
      email: formData.email,
      username: formData.login,
    };

    authModal.style.display = "none";
    
    showCustomAlert("Регистрация прошла успешно!");
  });

  // Добавляем обработчики для валидации при вводе
  registerForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      clearError(this);

      const field = this.id.replace("reg-", "");
      const value = this.value.trim();

      let error = null;
      switch (field) {
        case "name":
          error = validateName(value, "Имя");
          break;
        case "surname":
          error = validateName(value, "Фамилия");
          break;
        case "patronymic":
          if (value) error = validateName(value, "Отчество");
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
      }

      if (error) {
        showError(this, error);
      }
    });
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
