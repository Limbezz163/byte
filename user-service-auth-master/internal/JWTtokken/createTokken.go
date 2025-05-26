package JWTtokken

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func CreateJwtTokken(login, role string, id int) *jwt.Token {
	payload := jwt.MapClaims{
		"user_id": id,
		"sub":     login,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
		"iat":     time.Now().Unix(),
		"role":    role,
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, payload)
}
