package main

import (
	"catalog-restaurant/internal/handler"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/menu", handler.GetDishsOfMenu).Methods("GET")
	//r.HandleFunc("/menu/dish/{id}", handler.GetDish).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", r))
}
