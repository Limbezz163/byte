package handler

import (
	"catalog-restaurant/internal/database"
	"catalog-restaurant/internal/middleware"
	"encoding/json"
	"net/http"
)

func GetOrdersOfUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	orders, err := database.GetOrder(middleware.IdUser)
	if err != nil {

		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(orders)
}
