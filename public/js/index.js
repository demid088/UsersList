'use strict'

/**
 * Показать/Убрать индикатор загрузки
 * 
 * @param {Boolean} show 
 * @return {void}
 */
function ShowSpinner(show = true) {
  if (show) {
    document.querySelector("#spinner-wrapper").classList.remove('d-none')
  } else {
    document.querySelector("#spinner-wrapper").classList.add('d-none')
  }
}

/**
 * Cоздание строки для таблицы
 * 
 * @param {Object} user 
 * @param {Number} index
 * @returns {HTMLTableRowElement} Строка таблицы
 */
function row(user, index) {
  // TR
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", user._id);
  tr.className = 'align-middle'
  // TH
  const th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.append(index);
  tr.append(th);
  // TD name
  const tdName = document.createElement("td");
  tdName.append(user.name);
  tr.append(tdName);
  // TD age
  const tdAge = document.createElement("td");
  tdAge.append(user.age);
  tr.append(tdAge);
  // BUTTONS
  const tdButtons = document.createElement("td");
  // edit Button
  const editButton = document.createElement("button")
  editButton.setAttribute("data-id", user._id)
  editButton.setAttribute("type", "button")
  editButton.setAttribute('data-bs-toggle', 'modal')
  editButton.setAttribute('data-bs-target', '#modalEditUser')
  editButton.className = "btn btn-primary m-1"
  editButton.append("Изменить")
  editButton.addEventListener("click", e => {
      e.preventDefault()
  })

  tdButtons.append(editButton);
  // del Button
  const delButton = document.createElement("button");
  delButton.setAttribute("data-id", user._id);
  delButton.setAttribute("type", "button");
  delButton.setAttribute('data-bs-toggle', 'modal')
  delButton.setAttribute('data-bs-target', '#modalUserDel')
  delButton.className = "btn btn-danger m-1";
  delButton.append("Удалить");
  delButton.addEventListener("click", e => {
      e.preventDefault();
  });

  tdButtons.append(delButton);

  tr.appendChild(tdButtons);

  return tr;
}


// ==================================== TABLE ==========================

/**
 * Очистка таблицы (не используется)
 * 
 * @return {null}
 */
function ClearTable() {
  // таблица
  let tbody = document.querySelector("#tbody")
  // очищаем таблицу
  if (tbody.hasChildNodes())
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

/**
 * Добавляет данные в таблицу
 * 
 * @param {Array} users 
 * @return {null}
 */
function AddRow(users) {
  // таблица
  let tbody = document.querySelector("#tbody")
  // получаем кол-во записей в таблице
  const rowCount = tbody.rows.length
  // добавляем полученные элементы в таблицу
  users.forEach((user, index) => {
    tbody.append(row(user, index + 1 + rowCount));
  });
}

/**
 * Получениед данных из строки таблицы
 * 
 * @param {String} id пользователя
 * @return {Object} user данные из таблицы
 */
function GetRow(id) {
  const user = {}

  // таблица
  let tbody = document.querySelector("#tbody")
  // проходим по дочерним элементам
  for (let tr of tbody.rows) {
    if (id === tr.dataset.id) {
      user.name = tr.cells[1].innerHTML
      user.age = tr.cells[2].innerHTML
      break
    }
  }

  return user
}

/**
 * Изменение строки таблицы
 * 
 * @param {String} id пользователя
 * @param {String} name имя пользователя
 * @param {String} age возраст пользователя
 * @return {null}
 */
function EditRow(id, name, age) {
  // таблица
  let tbody = document.querySelector("#tbody")
  // проходим по дочерним элементам
  for (let tr of tbody.rows) {
    if (id === tr.dataset.id) {
      tr.cells[1].innerHTML = name
      tr.cells[2].innerHTML = age
      break
    }
  }
}

/**
 * Удаление строки таблицы
 * 
 * @param {String} id пользователя
 * @return {null}
 */
function DeleteRow(id) {
  // таблица
  let tbody = document.querySelector("#tbody")
  // проходим по дочерним элементам
  for (let tr of tbody.rows) {
    if (id === tr.dataset.id) {
      tr.remove()
      break
    }
  }
}

// ==================================== AJAX ==========================

/**
 * Получение всех пользователей
 * 
 * @return {Promise} users - объект с пользователями
 */
async function GetUsersAsync() {
  let users = {}

  ShowSpinner(true)
  // отправляет запрос и получаем ответ
  const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  // если запрос прошел нормально
  if (response.ok) {
      // обрабатываем полученные данные
      users = await response.json()
      ShowSpinner(false)
  } else {
    alert("Ошибка HTTP: " + response.status);
  }

  return users
}


//===================== ADD USER ==================================
//--- окно доб. пользователя
const modalAddUser = document.getElementById('modalAddUser')
//  очистка формы добавления пользователя
modalAddUser.addEventListener('show.bs.modal', async function (event) {
  // получаем поля формы
  const inputName = modalAddUser.querySelector('#inputName')
  const inputAge = modalAddUser.querySelector('#inputAge')
  // очищаем форму
  inputName.value = inputAge.value = ''
})
// Добавление пользователя
modalAddUser.addEventListener('submit', async (e) => {
  e.preventDefault()

  const user = {}
  user.name = e.target.userName.value
  user.age = e.target.userAge.value
  ShowSpinner(true)
  // отправляет запрос и получаем ответ
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });
  ShowSpinner(false)
  // если запрос прошел нормально
  if (response.ok) {
    // получаем ID нового пользователя
    user._id = await response.text()
    AddRow([user])
  } else {
    alert("Ошибка HTTP: " + response.status)
  }
})

//===================== EDIT USER ==================================

//--- Изменение пользователя
const modalEditUser = document.getElementById('modalEditUser')
//- загрузка пользователя в форму редактирования...
modalEditUser.addEventListener('show.bs.modal', async (event) => {
  // получаем поля формы
  const inputId = modalEditUser.querySelector('#inputId')
  const inputName = modalEditUser.querySelector('#inputName')
  const inputAge = modalEditUser.querySelector('#inputAge')
  // очищаем форму
  inputId.value = inputName.value = inputAge.value = ''
  // Кнопка, запускающая модальное окно
  const button = event.relatedTarget
  // Получаем ID пользователя
  const _id = button.getAttribute('data-id')
  // берем информацию из строки таблицы
  const user = GetRow(_id)
  // заполняем поля формы
  inputId.value = _id
  inputName.value = user.name
  inputAge.value = user.age
})

//- отправляем изменненые данные на сервер
modalEditUser.addEventListener('submit', async (e) => {
  e.preventDefault()

  const user = {}
  user.id = e.target.userId.value
  user.name = e.target.userName.value
  user.age = e.target.userAge.value
  ShowSpinner(true)
  // отправляет запрос и получаем ответ
  const response = await fetch(`/api/user/${user.id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });
  ShowSpinner(false)
  // если запрос прошел нормально
  if (response.ok) {
    EditRow(user.id, user.name, user.age)
  } else {
    alert("Ошибка HTTP: " + response.status)
  }

})


//===================== DELETE USER ==================================

//--- Удаление пользователя
const modalUserDel = document.getElementById('modalUserDel')
//- загрузка пользователя в форму удаления...
modalUserDel.addEventListener('show.bs.modal', async (event) => {
  // получаем поля формы
  const inputId = modalUserDel.querySelector('#inputId')
  const inputName = modalUserDel.querySelector('#inputName')
  const inputAge = modalUserDel.querySelector('#inputAge')
  // очищаем форму
  inputId.value = inputName.value = inputAge.value = ''
  // Кнопка, запускающая модальное окно
  const button = event.relatedTarget
  // Получаем ID пользователя
  const _id = button.getAttribute('data-id')
  // берем информацию из строки таблицы
  const user = GetRow(_id)
  // заполняем поля формы
  inputId.value = _id
  inputName.value = user.name
  inputAge.value = user.age
})

//- отправляем запрос на удаление
modalUserDel.addEventListener('submit', async (e) => {
  e.preventDefault()

  const _id = e.target.userId.value

  ShowSpinner(true)

  // отправляет запрос и получаем ответ
  const response = await fetch(`/api/user/${_id}`, {
    method: "DELETE",
    headers: {
      'Accept': 'application/json'
    }
  });

  ShowSpinner(false)

  // если запрос прошел нормально
  if (response.ok) {
    DeleteRow(_id)
  } else {
    alert("Ошибка HTTP: " + response.status)
  }
})


//===================== INIT ==================================

GetUsersAsync()
  .then(value => {
    AddRow(value)
  })
