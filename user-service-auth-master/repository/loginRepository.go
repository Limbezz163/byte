package repository

import (
  "context"
  "errors"
  "github.com/jackc/pgx/v5/pgxpool"
  "go.uber.org/zap"
  "user-service/internal/JWTtokken"
  "user-service/internal/auth"
  "user-service/internal/config"
  "user-service/internal/model"
)

type LoginRepository interface {
  Authenticate(Login *model.LoginRequest)
}

type loginRepository struct {
  dbpool *pgxpool.Pool
  logger *zap.Logger
}

func NewLoginRepository(dbpool *pgxpool.Pool, logger *zap.Logger) *loginRepository {
  return &loginRepository{dbpool: dbpool, logger: logger}
}

func (repo *loginRepository) Authenticate(login *model.LoginRequest) (model.LoginResponse, error) {
    var (
        id         int
        name       string
        surname    string
        patronymic string
        phone      string
        email      string
        loginUser  string
        password   string
        role       string
    )
    var authInfo model.LoginResponse

    // 1. Пробуем найти в таблице user
    err := repo.dbpool.QueryRow(
        context.Background(),
        `SELECT id, name, surname, patronymic, phone_number, email, login, password 
         FROM "user" 
         WHERE login = $1`,
        login.Login,
    ).Scan(&id, &name, &surname, &patronymic, &phone, &email, &loginUser, &password)

    if err != nil {
        // 2. Если не найден в user, ищем в employee
        err = repo.dbpool.QueryRow(
            context.Background(),
            `SELECT e.id, e.name, e.surname, e.patronymic, e.phone_number, e.email, e.login, e.password, jt.job_title 
             FROM "employee" e 
             INNER JOIN "job_title" jt ON e.id_job_title = jt.id  
             WHERE e.login = $1`,
            login.Login,
        ).Scan(&id, &name, &surname, &patronymic, &phone, &email, &loginUser, &password, &role)

        if err != nil {
            repo.logger.Error("Пользователь не найден", zap.String("login", login.Login), zap.Error(err))
            return authInfo, errors.New("логин или пароль неверны")
        }
    }

    // 3. Проверяем пароль
    if err := auth.CheckPassword(&password, &login.Password); err != nil {
    repo.logger.Error("Неверный пароль", zap.String("login", login.Login))
    return authInfo, errors.New("логин или пароль неверны")
}

    // 4. Генерируем JWT-токен
    token := JWTtokken.CreateJwtTokken(login.Login, role, id)
    signedToken, err := token.SignedString(config.JWTSecretKey)
    if err != nil {
        repo.logger.Error("Ошибка создания JWT", zap.Error(err))
        return authInfo, errors.New("ошибка при создании токена")
    }

    // 5. Формируем ответ
    user := model.Employee{
        ID:          id,
        JobTitle:    role, // для обычных users role будет пустой
        Email:       email,
        Name:        name,
        Surname:     surname,
        Patronymic:  patronymic,
        PhoneNumber: phone,
        Login:       loginUser,
        Password:    "", // не возвращаем пароль
    }

    authInfo = model.LoginResponse{
        AccessToken: signedToken,
        User:        user,
    }

    return authInfo, nil
}
