package main

import (
	"catalog-restaurant/internal/handler"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/menu", handler.GetDishsOfMenu).Methods("GET")
	//r.HandleFunc("/menu/dish/{id}", handler.GetDish).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", r))
}
