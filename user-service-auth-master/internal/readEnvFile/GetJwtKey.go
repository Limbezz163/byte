package readEnvFile

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetJwtKey() []byte {
	if err := godotenv.Load("key.env"); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	jwtKey := []byte(os.Getenv("JWT_KEY"))
	if len(jwtKey) == 0 {
		log.Fatal("JWT_KEY is not set in .env file")
	}
	return jwtKey
}
