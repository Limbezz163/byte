package cart

import (
	"catalog-restaurant/internal/database"
	"catalog-restaurant/internal/middleware"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"time"
)

func SetCreateSessionAndSaveToDb(session *sessions.Session) error {
	// Генерируем уникальный ID сессии
	sessionID := generateSessionID()
	session.Values["session_id"] = sessionID
	session.Values["created_at"] = time.Now().Unix()

	// Сохраняем нашу сессию в базу данных.
	err := database.InsertSession(sessionID, middleware.IdUser)
	if err != nil {
		return fmt.Errorf("Error inserting session into database: %v", err)
	}
	return nil
}

func generateSessionID() string {
	return "sess_" + uuid.New().String()
}
