package main

import (
	"catalog-restaurant/internal/handler"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// CORS middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// If it's a preflight OPTIONS request, respond immediately
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Next
		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()

	// Apply CORS middleware to all routes
	r.Use(enableCORS)

	r.HandleFunc("/menu", handler.GetDishsOfMenu).Methods("GET", "OPTIONS")
	//r.HandleFunc("/menu/dish/{id}", handler.GetDish).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", r))
}
