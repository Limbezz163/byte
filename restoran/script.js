// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentUser = null;
let cartItems = [];
let deliveryAddress = "";
let deliveryDateTime = null;
let userAddresses = [];
let selectedAddressIndex = -1;

// ===== ПОКАЗАТЬ/СКРЫТЬ МОДАЛЬНЫЕ ОКНА =====
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
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
const addressModal = document.getElementById("address-modal");
const closeBtns = document.querySelectorAll(".close");
const tabBtns = document.querySelectorAll(".tab-btn");
const authTabs = document.querySelectorAll(".auth-tab");
const changeToRegisterBtn = document.getElementById("change-to-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const checkoutBtn = document.getElementById("checkout-btn");
const saveAddressBtn = document.getElementById("save-address-btn");
const deliveryAddressInput = document.getElementById("delivery-address-input");
const addressForm = document.getElementById("address-form");

// Элементы для выбора времени доставки
const asapBtn = document.getElementById("asap-btn");
const scheduleBtn = document.getElementById("schedule-btn");
const timeSelection = document.getElementById("time-selection");
const datePicker = document.getElementById("delivery-date");
const timePicker = document.getElementById("delivery-time");

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
      <path d="${isSuccess
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
    phone_number: userData.phone_number || "",
  };
  sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateUserUI();
  loadUserAddresses();
}

function logoutUser() {
  if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
    // Список всех ключей, которые нужно удалить
    const keysToRemove = [
      'authToken',
      'userData',
      'userEmail',
      'userId',
      'userLogin',
      'userName',
      'userPatronymic',
      'userPassword',
      'userRole',
      'userSurname'
    ];

    // Удаляем каждый указанный ключ из sessionStorage
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Альтернативный вариант - полная очистка sessionStorage
    // sessionStorage.clear();

    // Перенаправляем на главную страницу
    window.location.href = "index.html";
  }
}

function updateUserUI() {
  if (document.getElementById("account-username")) {
    document.getElementById("account-username").textContent = currentUser
      ? `${currentUser.name} ${currentUser.surname}`
      : "Гость";
    document.getElementById("account-email").textContent =
      currentUser?.email || "Неизвестно";
    if (document.getElementById("account-phone")) {
      document.getElementById("account-phone").textContent =
        currentUser?.phone_number || "Не указан";
    }
  }

  if (deliveryAddressInput) {
    deliveryAddressInput.value = deliveryAddress;
  }
}

// ===== РАБОТА С АДРЕСАМИ ДОСТАВКИ =====
function loadUserAddresses() {
  if (!currentUser) return;

  const savedAddresses = sessionStorage.getItem(`addresses_${currentUser.email}`);
  if (savedAddresses) {
    userAddresses = JSON.parse(savedAddresses);
    renderAddresses();
  }
}

function saveUserAddresses() {
  if (currentUser) {
    sessionStorage.setItem(
      `addresses_${currentUser.email}`,
      JSON.stringify(userAddresses)
    );
  }
}

function renderAddresses() {
  const addressesList = document.querySelector(".addresses-list");
  if (!addressesList) return;

  addressesList.innerHTML = "";

  userAddresses.forEach((address, index) => {
    const addressItem = document.createElement("div");
    addressItem.className = "address-item";

    let addressText = `${address.city}, ${address.street}`;
    if (address.apartment) addressText += `, кв. ${address.apartment}`;
    if (address.entrance) addressText += `, подъезд ${address.entrance}`;
    if (address.floor) addressText += `, этаж ${address.floor}`;

    addressItem.innerHTML = `
      <div class="address-select">
  <input type="radio" name="delivery-address" id="address-${index}" value="${index}" 
         ${selectedAddressIndex === index ? "checked" : ""} class="custom-radio">
  <label for="address-${index}">${addressText}</label>
</div>
      <div class="address-actions">
        <button class="edit-address-btn" data-index="${index}">Изменить</button>
        <button class="delete-address-btn" data-index="${index}">Удалить</button>
      </div>
    `;

    addressesList.appendChild(addressItem);
  });

  // Добавляем обработчики для выбора адреса
  document
    .querySelectorAll('input[name="delivery-address"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        selectedAddressIndex = parseInt(this.value);
        if (userAddresses[selectedAddressIndex]) {
          deliveryAddress = formatAddress(userAddresses[selectedAddressIndex]);
          if (currentUser) {
            sessionStorage.setItem(
              `address_${currentUser.email}`,
              deliveryAddress
            );
          }
        }
      });
    });

  // Добавляем обработчики для кнопок
  document.querySelectorAll(".edit-address-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      editAddress(index);
    });
  });

  document.querySelectorAll(".delete-address-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      deleteAddress(index);
    });
  });
}

function formatAddress(address) {
  let formatted = `${address.city}, ${address.street}`;
  if (address.apartment) formatted += `, кв. ${address.apartment}`;
  if (address.entrance) formatted += `, подъезд ${address.entrance}`;
  if (address.floor) formatted += `, этаж ${address.floor}`;
  return formatted;
}

function addNewAddress(addressData) {
  userAddresses.push(addressData);
  saveUserAddresses();
  selectedAddressIndex = userAddresses.length - 1;
  deliveryAddress = formatAddress(addressData);
  if (currentUser) {
    sessionStorage.setItem(`address_${currentUser.email}`, deliveryAddress);
  }
  renderAddresses();
  hideModal("address-modal");
  showCustomAlert("Адрес успешно добавлен");
}

function editAddress(index) {
  if (index < 0 || index >= userAddresses.length) return;

  const address = userAddresses[index];
  const form = document.getElementById("address-form");

  // Заполняем форму данными адреса
  document.getElementById("address-city").value = address.city;
  document.getElementById("address-street").value = address.street;
  document.getElementById("address-entrance").value = address.entrance || "";
  document.getElementById("address-floor").value = address.floor || "";
  document.getElementById("address-apartment").value = address.apartment || "";

  // Меняем заголовок
  document.querySelector("#address-modal h2").textContent =
    "Редактировать адрес";

  // Удаляем старый обработчик (если есть)
  const oldFormSubmit = form._formSubmit;
  if (oldFormSubmit) {
    form.removeEventListener("submit", oldFormSubmit);
  }

  // Добавляем новый обработчик для сохранения изменений
  function handleEditSubmit(e) {
    e.preventDefault();

    const updatedAddress = {
      city: document.getElementById("address-city").value.trim(),
      street: document.getElementById("address-street").value.trim(),
      entrance: document.getElementById("address-entrance").value.trim(),
      floor: document.getElementById("address-floor").value.trim(),
      apartment: document.getElementById("address-apartment").value.trim(),
    };

    userAddresses[index] = updatedAddress;
    saveUserAddresses();
    if (selectedAddressIndex === index) {
      deliveryAddress = formatAddress(updatedAddress);
      if (currentUser) {
        sessionStorage.setItem(`address_${currentUser.email}`, deliveryAddress);
      }
    }
    renderAddresses();
    hideModal("address-modal");
    showCustomAlert("Адрес успешно обновлен");
  }

  form.addEventListener("submit", handleEditSubmit);
  form._formSubmit = handleEditSubmit;

  showModal("address-modal");
}

function deleteAddress(index) {
  if (confirm("Вы уверены, что хотите удалить этот адрес?")) {
    userAddresses.splice(index, 1);
    if (selectedAddressIndex === index) {
      selectedAddressIndex = -1;
      deliveryAddress = "";
      if (currentUser) {
        sessionStorage.removeItem(`address_${currentUser.email}`);
      }
    } else if (selectedAddressIndex > index) {
      selectedAddressIndex--;
    }
    saveUserAddresses();
    renderAddresses();
    showCustomAlert("Адрес успешно удален");
  }
}

function showAddAddressModal() {
  const form = document.getElementById("address-form");
  form.reset();
  document.querySelector("#address-modal h2").textContent =
    "Добавить адрес доставки";

  // Удаляем старый обработчик (если есть)
  const oldFormSubmit = form._formSubmit;
  if (oldFormSubmit) {
    form.removeEventListener("submit", oldFormSubmit);
  }

  // Добавляем обработчик для добавления нового адреса
  function handleAddSubmit(e) {
    e.preventDefault();

    const newAddress = {
      city: document.getElementById("address-city").value.trim(),
      street: document.getElementById("address-street").value.trim(),
      entrance: document.getElementById("address-entrance").value.trim(),
      floor: document.getElementById("address-floor").value.trim(),
      apartment: document.getElementById("address-apartment").value.trim(),
    };

    addNewAddress(newAddress);
  }

  form.addEventListener("submit", handleAddSubmit);
  form._formSubmit = handleAddSubmit;

  showModal("address-modal");
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
          <div class="cart-item-name">${item.name} × ${item.quantity}</div>
          <div class="cart-item-price">${item.price * item.quantity} ₽</div>
          <div class="cart-item-remove" data-id="${item.id}">×</div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotalPrice) cartTotalPrice.textContent = total;

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
    cartItems.push({ ...item, quantity: 1 });
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
    sessionStorage.setItem(
      `cart_${currentUser.email}`,
      JSON.stringify(cartItems)
    );
  }
}

function loadCart() {
  if (currentUser) {
    const savedCart = sessionStorage.getItem(`cart_${currentUser.email}`);
    if (savedCart) cartItems = JSON.parse(savedCart);
  }
  updateCartDisplay();
}

function loadDeliveryAddress() {
  if (currentUser) {
    const savedAddress = sessionStorage.getItem(`address_${currentUser.email}`);
    if (savedAddress) {
      deliveryAddress = savedAddress;
      // Находим индекс адреса в массиве
      const addressParts = savedAddress.split(", ");
      if (addressParts.length >= 2) {
        const city = addressParts[0];
        const street = addressParts[1];
        selectedAddressIndex = userAddresses.findIndex(
          (addr) => addr.city === city && addr.street === street
        );
      }
    }
  }
}

// ===== РАБОТА С ДАТОЙ И ВРЕМЕНЕМ ДОСТАВКИ =====
function initDateTimePickers() {
  if (!datePicker || !timePicker) return;

  // Инициализация календаря
  const datePickerInstance = flatpickr(datePicker, {
    minDate: "today",
    dateFormat: "d.m.Y",
    locale: "ru",
    disableMobile: true,
    onChange: function (selectedDates) {
      if (selectedDates[0]) {
        deliveryDateTime = selectedDates[0];
        // Сохраняем часы и минуты если время уже было выбрано
        if (deliveryDateTime) {
          const hours = deliveryDateTime.getHours();
          const minutes = deliveryDateTime.getMinutes();
          selectedDates[0].setHours(hours, minutes);
        }
      }
    },
  });

  // Инициализация времени
  const timePickerInstance = flatpickr(timePicker, {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    minuteIncrement: 5,
    time_24hr: true,
    disableMobile: true,
    onChange: function (selectedDates) {
      if (selectedDates[0] && deliveryDateTime) {
        const hours = selectedDates[0].getHours();
        const minutes = selectedDates[0].getMinutes();
        deliveryDateTime.setHours(hours, minutes);
      }
    },
  });

  // Стилизация
  const style = document.createElement("style");
  style.textContent = `
    .flatpickr-calendar {
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      border-radius: 10px;
      font-family: inherit;
    }
    .flatpickr-day.selected {
      background: #5B120D;
      border-color: #5B120D;
    }
    .flatpickr-day.today.selected {
      background: #7a1a13;
      border-color: #7a1a13;
    }
    .flatpickr-time input:hover {
      background: rgba(91, 18, 13, 0.1);
    }
  `;
  document.head.appendChild(style);
}

function loadFlatpickr() {
  return new Promise((resolve) => {
    if (typeof flatpickr !== "undefined") {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    script.onload = () => {
      const localeScript = document.createElement("script");
      localeScript.src = "https://npmcdn.com/flatpickr/dist/l10n/ru.js";
      localeScript.onload = resolve;
      document.head.appendChild(localeScript);
    };
    document.head.appendChild(script);
  });
}

function initDeliveryTimeSelection() {
  if (!asapBtn || !scheduleBtn || !timeSelection) return;

  scheduleBtn.addEventListener("click", function () {
    this.classList.add("active");
    asapBtn.classList.remove("active");
    timeSelection.style.display = "block";
    deliveryDateTime = null;
  });

  asapBtn.addEventListener("click", function () {
    this.classList.add("active");
    scheduleBtn.classList.remove("active");
    timeSelection.style.display = "none";
    deliveryDateTime = new Date();
  });

  // По умолчанию выбираем "Как можно быстрее"
  if (asapBtn) {
    asapBtn.classList.add("active");
    deliveryDateTime = new Date();
  }
}

// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
function checkoutOrder() {
  if (cartItems.length === 0) {
    showCustomAlert("Ваша корзина пуста", false);
    return false;
  }

  if (selectedAddressIndex === -1 || !deliveryAddress) {
    showCustomAlert("Пожалуйста, выберите адрес доставки", false);
    return false;
  }

  if (scheduleBtn.classList.contains("active") && !deliveryDateTime) {
    showCustomAlert("Пожалуйста, укажите дату и время доставки", false);
    return false;
  }

  const orderData = {
    user: currentUser,
    items: cartItems,
    deliveryAddress: userAddresses[selectedAddressIndex],
    deliveryTime: deliveryDateTime,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  console.log("Order data:", orderData);
  showCustomAlert("Заказ успешно оформлен!");
  clearCart();
  hideModal("cart-modal");
  return true;
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
document.addEventListener("DOMContentLoaded", function () {
  // Загрузка данных пользователя
  const savedUser = sessionStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    loadCart();
    loadUserAddresses();
    loadDeliveryAddress();
    updateUserUI();
  }

  // Инициализация интерфейсов
  updateCartDisplay();
  initDeliveryTimeSelection();

  // Загрузка Flatpickr
  loadFlatpickr().then(initDateTimePickers);

  // Обработчики для личного кабинета
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
  const logoutBtn1 = document.querySelector(".logout-btn1");
  if (logoutBtn1) {
    logoutBtn1.addEventListener("click", logoutUser);
  }
  const accountCloseBtn = document.querySelector(".account-close-btn");
  if (accountCloseBtn) {
    accountCloseBtn.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  const addAddressBtn = document.querySelector(".add-address-btn");
  if (addAddressBtn) {
    addAddressBtn.addEventListener("click", showAddAddressModal);
  }

  // Обработчики для модальных окон
  if (authBtn) {
    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentUser = sessionStorage.getItem('userLogin');
      const userRole = sessionStorage.getItem('userRole');

      if (currentUser) {
        // Перенаправляем в зависимости от роли
        switch (userRole) {
          case 'client':
            window.location.href = "account.html";
            break;
          case 'manager':
            window.location.href = "manager.html";
            break;
          case 'administrator':
            window.location.href = "admin.html";
            break;
          case 'courier':
            window.location.href = "courier.html";
            break;
          default:
            window.location.href = "account.html";
        }
      } else {
        // Если пользователь не авторизован, показываем модальное окно авторизации
        showModal("auth-modal");
        document.querySelector('.tab-btn[data-tab="login"]').click();
      }
    });
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      if (!currentUser) {
        showCustomAlert(
          "Для доступа к корзине необходимо авторизоваться",
          false
        );
        showModal("auth-modal");
        return;
      }
      showModal("cart-modal");
    });
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      hideModal(this.closest(".modal").id);
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      hideModal(e.target.id);
    }
  });

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

  if (changeToRegisterBtn) {
    changeToRegisterBtn.addEventListener("click", () => {
      document.querySelector('.tab-btn[data-tab="register"]').click();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkoutOrder);
  }

  if (saveAddressBtn && deliveryAddressInput) {
    saveAddressBtn.addEventListener("click", () => {
      deliveryAddress = deliveryAddressInput.value.trim();
      if (currentUser) {
        sessionStorage.setItem(`address_${currentUser.email}`, deliveryAddress);
        showCustomAlert("Адрес доставки сохранен");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Показываем индикатор загрузки
      const submitBtn = loginForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Вход...';

      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();

      // Валидация
      const loginError = validateLength(username, 4, 20, "Логин");
      const passwordError = validateLength(password, 5, 20, "Пароль");

      if (loginError) showError(document.getElementById("login-username"), loginError);
      if (passwordError) showError(document.getElementById("login-password"), passwordError);

      if (loginError || passwordError) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ВОЙТИ';
        return;
      }

      try {
        // Отправляем данные на бекенд
        const response = await fetch('http://localhost:8000/users/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: username,
            password: password
          }),
          credentials: 'include' // Для работы с куками/сессиями
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка входа');
        }

        const data = await response.json();

        // Сохраняем токен (если используется JWT)
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }

        // Сохраняем данные пользователя
        if (data.user) {
          sessionStorage.setItem('userData', JSON.stringify(data.user));
        }
        if (data.access_token) {
          sessionStorage.setItem('authToken', data.access_token);
        }
        if (data.user.id) {
          sessionStorage.setItem('userId', data.user.id);
        }
        if (data.user.email) {
          sessionStorage.setItem('userEmail', data.user.email);
        }
        if (data.user.name) {
          sessionStorage.setItem('userName', data.user.name);
        }
        if (data.user.surname) {
          sessionStorage.setItem('userSurname', data.user.surname);
        }
        if (data.user.patronymic) {
          sessionStorage.setItem('userPatronymic', data.user.patronymic);
        }
        if (data.user.phone_number) {
          sessionStorage.setItem('userPhoneNumber', data.user.phone_number);
        }
        if (data.user.login) {
          sessionStorage.setItem('userLogin', data.user.login);
        }
        if (data.user.password) {
          sessionStorage.setItem('userPassword', data.user.password);
        }
        if (data.user.job_title) {
          sessionStorage.setItem('userRole', data.user.job_title);
        }
        else {
          sessionStorage.setItem('userRole', "Client");
        }


        hideModal("auth-modal");
        showCustomAlert("Вы успешно вошли!");

        if (data.user.job_title === "manager") {
          window.location.href = 'manager.html';
        }
        if (data.user.job_title === "delivery_man") {
          window.location.href = 'courier.html';
        }
        if (data.user.job_title === "administrator") {
          window.location.href = 'admin.html';
        }
        else {
          window.location.href = 'account.html';
        }
        // Перенаправляем в личный кабинет


      } catch (error) {
        console.error('Ошибка входа:', error);
        showCustomAlert(error.message || 'Неверный логин или пароль', false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ВОЙТИ';
      }
    });

    loginForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", function () {
        clearError(this);
      });
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      let hasErrors = false;
      const formData = {
        name: document.getElementById("reg-name").value.trim(),
        surname: document.getElementById("reg-surname").value.trim(),
        patronymic: document.getElementById("reg-patronymic").value.trim(),
        phone_number: document.getElementById("reg-phone").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        login: document.getElementById("reg-login").value.trim(),
        password: document.getElementById("reg-password").value.trim(),
      };

      document.querySelectorAll(".error-message").forEach((el) => el.remove());
      document.querySelectorAll(".form-group input").forEach((input) => {
        input.classList.remove("invalid");
      });

      const errors = {
        name: validateLength(formData.name, 2, 30, "Имя") || validateName(formData.name, "Имя"),
        surname: validateLength(formData.surname, 2, 30, "Фамилия") || validateName(formData.surname, "Фамилия"),
        patronymic: formData.patronymic
          ? validateLength(formData.patronymic, 2, 30, "Отчество") || validateName(formData.patronymic, "Отчество")
          : null,
        phone_number: validatePhone(formData.phone_number),
        email: validateEmail(formData.email),
        login: validateLength(formData.login, 4, 20, "Логин"),
        password: validateLength(formData.password, 5, 20, "Пароль"),
      };

      Object.keys(errors).forEach((field) => {
        if (errors[field]) {
          showError(document.getElementById(`reg-${field}`), errors[field]);
          hasErrors = true;
        }
      });

      if (hasErrors) {
        showCustomAlert("Пожалуйста, исправьте ошибки в форме", false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/users/register', { // Укажите правильный endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка регистрации');
        }

        const data = await response.json();

        // Сохраняем токен, если он пришел в ответе
        if (data.access_token) {
          sessionStorage.setItem('authToken', data.access_token);
        }
        if (data.user.id) {
          sessionStorage.setItem('userId', data.user.id);
        }
        if (data.user.email) {
          sessionStorage.setItem('userEmail', data.user.email);
        }
        if (data.user.name) {
          sessionStorage.setItem('userName', data.user.name);
        }
        if (data.user.surname) {
          sessionStorage.setItem('userSurname', data.user.surname);
        }
        if (data.user.patronymic) {
          sessionStorage.setItem('userPatronymic', data.user.patronymic);
        }
        if (data.user.phone_number) {
          sessionStorage.setItem('userPhoneNumber', data.user.phone_number);
        }
        if (data.user.login) {
          sessionStorage.setItem('userLogin', data.user.login);
        }
        if (data.user.password) {
          sessionStorage.setItem('userPassword', data.user.password);
        }

        sessionStorage.setItem('userRole', "client");
        hideModal("auth-modal");
        showCustomAlert("Регистрация прошла успешно!");

        // Обновляем состояние приложения или перенаправляем пользователя
        // Например: window.location.href = '/profile';

      } catch (error) {
        console.error('Ошибка регистрации:', error);
        showCustomAlert(error.message || 'Произошла ошибка при регистрации', false);
      }
    });

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

        if (error) showError(this, error);
      });
    });
  }

  // Переключение между меню (если есть)
  const switchButtons = document.querySelectorAll(".menu-switch-btn");
  const menuContents = document.querySelectorAll(".menu-content");

  switchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      switchButtons.forEach((btn) => btn.classList.remove("active"));
      menuContents.forEach((content) =>
        content.classList.remove("active-content")
      );
      this.classList.add("active");
      document
        .getElementById(`${this.getAttribute("data-menu")}-menu`)
        .classList.add("active-content");
    });
  });
});
