package handler

import (
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"net/http"
	"os"
	"time"
)

var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_ENCRYPTION_KEY")))

func CreateCartSession(w http.ResponseWriter, r *http.Request) string {
	session, _ := store.Get(r, "cart-session")
	if session.IsNew {
		// Генерируем уникальный ID сессии
		sessionID := generateSessionID()
		session.Values["session_id"] = sessionID
		session.Values["created_at"] = time.Now().Unix()

		err := session.Save(r, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return ""
		}
		return sessionID
	}
	return session.Values["session_id"].(string)
}

func generateSessionID() string {
	return "sess_" + uuid.New().String()
}
