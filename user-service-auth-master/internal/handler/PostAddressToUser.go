package handler

import (
	"encoding/json"
	"net/http"
	"user-service/internal/database"
	"user-service/internal/model"
)

func PostAddressToUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")

	var address model.Address

	err := json.NewDecoder(r.Body).Decode(&address)

	if err != nil {
		WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	address, err = database.AddAddress(address)
	if err != nil {
		WriteError(w, http.StatusBadRequest, err.Error())
		return
	}
	json.NewEncoder(w).Encode(address)
}
