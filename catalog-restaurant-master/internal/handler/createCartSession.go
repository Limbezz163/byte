package handler

import (
	"catalog-restaurant/cart"
	"github.com/gorilla/sessions"
	"net/http"
	"os"
)

// createCartSession проверяем есть ли токен, если его нет, то мы создаем и назначаем пользователя через JWT
func createCartSession(w http.ResponseWriter, r *http.Request) string {
	var store = sessions.NewCookieStore([]byte(os.Getenv("JWT_KEY")))
	session, _ := store.Get(r, "cart-session")
	if session.IsNew {

		err := cart.SetCreateSessionAndSaveToDb(session)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return ""
		}

		err = session.Save(r, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return ""
		}
	}

	return session.Values["session_id"].(string)
}
