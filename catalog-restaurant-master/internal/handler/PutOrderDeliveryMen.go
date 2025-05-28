package handler

import (
	"catalog-restaurant/internal/database"
	"catalog-restaurant/internal/model"
	"encoding/json"
	"net/http"
)

func PutOrderDeliveryMen(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	var order model.OrderPutDeliveryMen
	err := json.NewDecoder(r.Body).Decode(&order)

	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	order, err = database.UpdateOrderDeliveryMen(order)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(order)
}
