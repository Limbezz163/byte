package jwtTokken

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
