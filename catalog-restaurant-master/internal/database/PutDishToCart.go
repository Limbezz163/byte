package database

import (
	"catalog-restaurant/internal/model"
	"context"
)

func PutDishToCart(session, dish string, quantity int) (model.CartItem, error) {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	var cart model.CartItem
	var id int

	err := dbpool.QueryRow(
		context.Background(),
		`UPDATE cart 
             SET quantity = $1 
             WHERE dish_id = (SELECT id FROM menu WHERE dish_name = $2) AND session_id = $3, 
             RETURNING id`,
		quantity, dish, session,
	).Scan(&id)

	if err != nil {
		return cart, err
	}

	cart = model.CartItem{id, session, dish, quantity}

	return cart, nil
}
