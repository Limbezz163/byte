package main

import (
	"catalog-restaurant/internal/handler"
	logger2 "catalog-restaurant/internal/logger"
	myCors "catalog-restaurant/internal/myCore"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

var jwtKey = []byte(os.Getenv("JWT_KEY"))

func main() {
	// Загружаем .env файл
	err := godotenv.Load()

	sessionKey := os.Getenv("SESSION_ENCRYPTION_KEY")

	logger := logger2.InitLogger()
	logger.Info("Запуск сервера")
	r := mux.NewRouter()

	ports, err := myCors.CreateArrOfPorts("3000", "8000")
	if err != nil {
		logger.Error("Ошибка создание портов для cors")
		return
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   ports,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	})

	r.HandleFunc("/api/menu", handler.GetDishsOfMenu).Methods("GET")
	r.HandleFunc("/cart", handler.GetDishsOfCart).Methods("GET")
	//r.HandleFunc("/menu/dish/{id}", handler.GetDish).Methods("GET")

	// Обертываем роутер в CORS middleware
	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":8001", handler))
	logger.Info("Сервер запущен")
}
