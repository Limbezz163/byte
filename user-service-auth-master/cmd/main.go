package main

import (
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"log"
	"net/http"
	"user-service/internal/auth"
	"user-service/internal/config"
	"user-service/internal/handler"
	"user-service/internal/logger"
	"user-service/internal/myCors"
	"user-service/internal/readEnvFile"
)

func main() {
	jwtKey := readEnvFile.GetJwtKey()

	logger := logger.InitLogger()
	defer logger.Sync()

	config.Init(jwtKey)
	logger.Info("JTW key created successfully")

	logger.Info("Launch user handlers")
	r := mux.NewRouter()

	ports, err := myCors.CreateArrOfPorts("5500", "8000")
	if err != nil {
		logger.Error("Ошибка создание портов для cors")
		return
	}

	ports= append (ports, "http://127.0.0.1:5500")

	c := cors.New(cors.Options{
		AllowedOrigins:   ports,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	})

	r.HandleFunc("/users/{id}", handler.GetInfoUser).Methods("GET")
	r.HandleFunc("/users/register", handler.PostRegisterUser).Methods("POST")
	r.HandleFunc("/users/auth", handler.PostLogin).Methods("POST")
	r.HandleFunc("/users/updateUser", auth.JWTAuthMiddleware(handler.PutUser)).Methods("PUT")
	r.HandleFunc("/users/address", auth.JWTAuthMiddleware(handler.PostAddressToUser)).Methods("POST")

	logger.Info("User handlers work correctly")

	r.HandleFunc("/users/employee", auth.JWTAuthMiddleware(handler.PostRegisterEmployee)).Methods("POST")

	// Обертываем роутер в CORS middleware
	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":8000", handler))
}
