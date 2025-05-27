package jwtTokken


import (
	"github.com/golang-jwt/jwt/v5"
)


type User struct {
	ID          int    `json:"id"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	Surname     string `json:"surname"`
	Patronymic  string `json:"patronymic"`
	PhoneNumber string `json:"phone_number"`
	Login       string `json:"login"`
	Password    string `json:"password"`
}

func validateToken(tokenString string) (*User, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte("secret-key"), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &User{
			ID:    int(claims["user_id"].(float64)),
			Email: claims["email"].(string),
		}, nil
	}

	return nil, err
}
