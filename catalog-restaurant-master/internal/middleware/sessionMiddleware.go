package middleware

import (
	"catalog-restaurant/internal/database"
	"catalog-restaurant/internal/session"
	"net/http"
)

func SessionMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_id")

		// Если куки у нас пустые, то создаем сессию
		if err != nil {
			value, err := session.GenerateSessionKey()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
			}
			cookie = &http.Cookie{
				Name:     "session_id",
				Value:    value,
				Path:     "/",
				MaxAge:   30 * 24 * 60 * 60,       // 30 дней в секундах
				HttpOnly: true,                    // Доступ только через HTTP, защита от XSS
				Secure:   true,                    // Только HTTPS
				SameSite: http.SameSiteStrictMode, // Защита от CSRF
			}
			database.InsertSession(value)

			http.SetCookie(w, cookie) // Отправляем куку клиенту
		}
		cookie.Value
	}
}
