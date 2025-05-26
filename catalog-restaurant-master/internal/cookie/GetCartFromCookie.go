package cookie

import (
	"catalog-restaurant/internal/model"
	"encoding/json"
	"net/http"
)

func GetCartFromCookie(r *http.Request) (*model.CartItem, error) {
	cookie, err := r.Cookie("cart")
	if err != nil {
		return nil, err
	}

	var cart model.CartItem

	err = json.Unmarshal([]byte(cookie.Value), &cart)
	if err != nil {
		return nil, err
	}

	return &cart, nil
}
