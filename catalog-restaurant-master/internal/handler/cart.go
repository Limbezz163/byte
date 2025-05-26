package handler

import (
	"catalog-restaurant/internal/model"
	"net/http"
)

type CartHandler interface {
	GetDishsOfCart(w http.ResponseWriter, r *http.Request)
	PostDishOfCart(w http.ResponseWriter, r *http.Request)
	PutDishOfCart(w http.ResponseWriter, r *http.Request)
	DeleteDishOfCart(w http.ResponseWriter, r *http.Request)
}

type CartHandlerImpl struct {
	cart model.CartItem
}

func (c *CartHandlerImpl) GetDishsOfCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

}
