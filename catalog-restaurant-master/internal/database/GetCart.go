package database

import (
	"catalog-restaurant/internal/model"
	"context"
)

func GetCart(session string) (model.CartItem, error) {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	var cart model.CartItem
	var quantity, id int
	var dish string

	err := dbpool.QueryRow(context.Background(), `SELECT c.id, m.dish_name, c.quantity FROM "cart" c INNER JOIN "menu" m ON m.id = c.dish_id WHERE c.session_id = $1`, session).Scan(&id, &dish, &quantity)
	if err != nil {
		return cart, err
	}
	cart = model.CartItem{id, session, dish, quantity}

	return cart, nil
}
