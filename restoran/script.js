// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentUser = null;
let cartItems = [];
let deliveryAddress = "";

// ===== ПОКАЗАТЬ/СКРЫТЬ МОДАЛЬНЫЕ ОКНА =====
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "block";
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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
const cartIcon = document.getElementById("cart-icon");
const authModal = document.getElementById("auth-modal");
const accountModal = document.getElementById("account-modal");
const cartModal = document.getElementById("cart-modal");
const closeBtns = document.querySelectorAll(".close");
const tabBtns = document.querySelectorAll(".tab-btn");
const authTabs = document.querySelectorAll(".auth-tab");
const changeToRegisterBtn = document.getElementById("change-to-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const checkoutBtn = document.getElementById("checkout-btn");
const saveAddressBtn = document.getElementById("save-address-btn");
const deliveryAddressInput = document.getElementById("delivery-address-input");

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

// ===== РАБОТА С ПОЛЬЗОВАТЕЛЕМ =====
function loginUser(userData) {
  currentUser = {
    email: userData.email || userData.login,
    username: userData.login,
    name: userData.name,
    surname: userData.surname,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateUserUI();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUserUI();
}

function updateUserUI() {
  // Обновляем информацию в личном кабинете
  if (document.getElementById("account-username")) {
    document.getElementById("account-username").textContent = currentUser
      ? `${currentUser.name} ${currentUser.surname}`
      : "Гость";
    document.getElementById("account-email").textContent =
      currentUser?.email || "Неизвестно";
  }

  // Обновляем адрес доставки
  if (deliveryAddressInput) {
    deliveryAddressInput.value = deliveryAddress;
  }
}

// ===== РАБОТА С КОРЗИНОЙ =====
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalPrice = document.getElementById("cart-total-price");

  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Ваша корзина пуста</p>';
    if (cartTotalPrice) cartTotalPrice.textContent = "0";
  } else {
    let html = "";
    let total = 0;

    cartItems.forEach((item) => {
      total += item.price * item.quantity;
      html += `
                <div class="cart-item">
                    <div class="cart-item-name">${item.name} × ${
        item.quantity
      }</div>
                    <div class="cart-item-price">${
                      item.price * item.quantity
                    } ₽</div>
                    <div class="cart-item-remove" data-id="${item.id}">×</div>
                </div>
            `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotalPrice) cartTotalPrice.textContent = total;

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemId = this.getAttribute("data-id");
        removeFromCart(itemId);
      });
    });
  }
}

function addToCart(item) {
  if (!currentUser) {
    showCustomAlert(
      "Для добавления в корзину необходимо авторизоваться",
      false
    );
    showModal("auth-modal");
    return;
  }

  const existingItem = cartItems.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...item,
      quantity: 1,
    });
  }

  saveCart();
  showCustomAlert(`"${item.name}" добавлен в корзину`);
  updateCartDisplay();
}

function removeFromCart(itemId) {
  cartItems = cartItems.filter((item) => item.id !== itemId);
  saveCart();
  updateCartDisplay();
  showCustomAlert("Товар удален из корзины");
}

function clearCart() {
  cartItems = [];
  saveCart();
  updateCartDisplay();
}

function saveCart() {
  if (currentUser) {
    localStorage.setItem(
      `cart_${currentUser.email}`,
      JSON.stringify(cartItems)
    );
  }
}

function loadCart() {
  if (currentUser) {
    const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
    if (savedCart) {
      cartItems = JSON.parse(savedCart);
    }
  }
  updateCartDisplay();
}

function loadDeliveryAddress() {
  if (currentUser) {
    const savedAddress = localStorage.getItem(`address_${currentUser.email}`);
    if (savedAddress) {
      deliveryAddress = savedAddress;
    }
  }
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
// Открытие модальных окон
if (authBtn) {
  authBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUser) {
      window.location.href = "account.html";
    } else {
      showModal("auth-modal");
      document.querySelector('.tab-btn[data-tab="login"]').click();
    }
  });
}

if (cartIcon) {
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentUser) {
      showCustomAlert("Для доступа к корзине необходимо авторизоваться", false);
      showModal("auth-modal");
      return;
    }
    showModal("cart-modal");
  });
}

// Закрытие модальных окон
closeBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    hideModal(this.closest(".modal").id);
  });
});

// Закрытие при клике вне окна
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    hideModal(e.target.id);
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

// Оформление заказа
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cartItems.length === 0) {
      showCustomAlert("Ваша корзина пуста", false);
      return;
    }

    if (!deliveryAddress) {
      showCustomAlert("Пожалуйста, укажите адрес доставки", false);
      return;
    }

    // Здесь можно добавить логику оформления заказа
    showCustomAlert("Заказ успешно оформлен!");
    clearCart();
    hideModal("cart-modal");
  });
}

// Сохранение адреса доставки
if (saveAddressBtn && deliveryAddressInput) {
  saveAddressBtn.addEventListener("click", () => {
    deliveryAddress = deliveryAddressInput.value.trim();
    if (currentUser) {
      localStorage.setItem(`address_${currentUser.email}`, deliveryAddress);
      showCustomAlert("Адрес доставки сохранен");
    }
  });
}

// Обработка формы входа
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Проверка длины логина и пароля
    const loginError = validateLength(username, 4, 20, "Логин");
    const passwordError = validateLength(password, 6, 20, "Пароль");

    if (loginError) {
      showError(document.getElementById("login-username"), loginError);
      return;
    }

    if (passwordError) {
      showError(document.getElementById("login-password"), passwordError);
      return;
    }

    loginUser({
      login: username,
      email: username,
    });

    hideModal("auth-modal");
    showCustomAlert("Вы успешно вошли!");
    loadCart();
    loadDeliveryAddress();
    updateUserUI();
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
        validateLength(formData.name, 2, 30, "Имя") ||
        validateName(formData.name, "Имя"),
      surname:
        validateLength(formData.surname, 2, 30, "Фамилия") ||
        validateName(formData.surname, "Фамилия"),
      patronymic: formData.patronymic
        ? validateLength(formData.patronymic, 2, 30, "Отчество") ||
          validateName(formData.patronymic, "Отчество")
        : null,
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      login: validateLength(formData.login, 4, 20, "Логин"),
      password: validateLength(formData.password, 6, 20, "Пароль"),
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
    loginUser(formData);
    hideModal("auth-modal");
    showCustomAlert("Регистрация прошла успешно!");
    updateUserUI();
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


// Закрытие личного кабинета
document.querySelector('.close-account-btn').addEventListener('click', function() {
  window.location.href = 'index.html';
});

// Выход из аккаунта
document.querySelector('.logout-btn').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem(`cart_${currentUser?.email}`);
  localStorage.removeItem(`address_${currentUser?.email}`);
  window.location.href = 'index.html';
});

// // Сохранение нового адреса
// document.getElementById('save-address-btn').addEventListener('click', function() {
//   const newAddress = document.getElementById('new-address').value.trim();
//   if (newAddress) {
//       if (currentUser) {
//           localStorage.setItem(`address_${currentUser.email}`, newAddress);
//           document.getElementById('current-address-text').textContent = newAddress;
//           document.getElementById('new-address').value = '';
//           showCustomAlert('Адрес успешно сохранен');
//       }
//   } else {
//       showCustomAlert('Введите адрес', false);
//   }
// });

// // Загрузка данных пользователя при открытии страницы
// document.addEventListener('DOMContentLoaded', function() {
//   const savedUser = localStorage.getItem('currentUser');
//   if (savedUser) {
//       currentUser = JSON.parse(savedUser);
      
//       // Заполняем данные пользователя
//       document.getElementById('user-name').textContent = currentUser.name || 'Не указано';
//       document.getElementById('user-surname').textContent = currentUser.surname || 'Не указано';
//       document.getElementById('user-phone').textContent = currentUser.phone || 'Не указано';
//       document.getElementById('user-email').textContent = currentUser.email || 'Не указано';
      
//       // Загружаем адрес доставки
//       const savedAddress = localStorage.getItem(`address_${currentUser.email}`);
//       if (savedAddress) {
//           document.getElementById('current-address-text').textContent = savedAddress;
//       }
//   }
// });




// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Загружаем данные пользователя из localStorage
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    loadCart();
    loadDeliveryAddress();
    updateUserUI();
  }

  // Инициализация корзины
  updateCartDisplay();

  // Переключение между меню (если есть на странице)
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

// Глобальные переменные
let userAddresses = [];
let defaultAddressId = null;

// Функция для отображения адресов
function renderAddresses() {
    const addressesList = document.getElementById('addresses-list');
    
    if (userAddresses.length === 0) {
        addressesList.innerHTML = `
            <div class="no-addresses">
                <p>У вас нет сохранённых адресов</p>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = '';
    
    userAddresses.forEach(address => {
        const addressElement = document.createElement('div');
        addressElement.className = `address-card ${address.id === defaultAddressId ? 'selected' : ''}`;
        addressElement.dataset.id = address.id;
        
        let details = [];
        if (address.entrance) details.push(`подъезд ${address.entrance}`);
        if (address.floor) details.push(`этаж ${address.floor}`);
        if (address.apartment) details.push(`кв. ${address.apartment}`);
        
        addressElement.innerHTML = `
            <div class="address-text">${address.city}, ${address.street}</div>
            ${details.length ? `<div class="address-details">${details.join(', ')}</div>` : ''}
            ${address.id === defaultAddressId ? '<div class="default-badge">По умолчанию</div>' : ''}
        `;
        
        addressElement.addEventListener('click', () => selectAddress(address.id));
        addressesList.appendChild(addressElement);
    });
}

// Функция выбора адреса
function selectAddress(addressId) {
    defaultAddressId = addressId;
    if (currentUser) {
        localStorage.setItem(`default_address_${currentUser.email}`, addressId);
    }
    renderAddresses();
}

// Функция добавления нового адреса
function addNewAddress(addressData) {
    const newAddress = {
        id: Date.now().toString(),
        ...addressData,
        isDefault: document.getElementById('default-address').checked
    };
    
    userAddresses.push(newAddress);
    
    if (newAddress.isDefault) {
        selectAddress(newAddress.id);
    }
    
    if (currentUser) {
        localStorage.setItem(`addresses_${currentUser.email}`, JSON.stringify(userAddresses));
    }
    
    renderAddresses();
}

// Обработчик формы добавления адреса
document.getElementById('address-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const addressData = {
        city: document.getElementById('city').value.trim(),
        street: document.getElementById('street').value.trim(),
        entrance: document.getElementById('entrance').value.trim(),
        floor: document.getElementById('floor').value.trim(),
        apartment: document.getElementById('apartment').value.trim()
    };
    
    if (!addressData.city || !addressData.street) {
        showCustomAlert('Заполните обязательные поля (город и адрес)', false);
        return;
    }
    
    addNewAddress(addressData);
    document.getElementById('address-form').reset();
    hideModal('address-modal');
    showCustomAlert('Адрес успешно добавлен');
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        // Загрузка сохранённых адресов
        const savedAddresses = localStorage.getItem(`addresses_${currentUser.email}`);
        if (savedAddresses) {
            userAddresses = JSON.parse(savedAddresses);
        }
        
        // Загрузка адреса по умолчанию
        const savedDefaultAddress = localStorage.getItem(`default_address_${currentUser.email}`);
        if (savedDefaultAddress) {
            defaultAddressId = savedDefaultAddress;
        } else if (userAddresses.length > 0) {
            defaultAddressId = userAddresses[0].id;
        }
        
        renderAddresses();
    }
});

// Открытие модального окна
document.getElementById('add-address-btn').addEventListener('click', function() {
    showModal('address-modal');
});
