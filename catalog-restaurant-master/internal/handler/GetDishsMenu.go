package handler

import (
	"catalog-restaurant/internal/database"
	"encoding/json"
	"net/http"
)

func GetDishsMenu(w http.ResponseWriter, r *http.Request) {
	mySession := createCartSession(w, r)
	dishs, err := database.GetCart(mySession)
	if err != nil {
		json.NewEncoder(w).Encode(err)
		return
	}
	json.NewEncoder(w).Encode(dishs)
}
