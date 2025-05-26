package database

import (
	"catalog-restaurant/internal/model"
	"context"
	"fmt"
)

func GetCart(session string) (model.CartItems, error) {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	var cart model.CartItems
	var cartItems []model.CartItem

	rows, err := dbpool.Query(context.Background(), `SELECT c.id, m.dish_name, c.quantity FROM "cart" c INNER JOIN "menu" m ON m.id = c.dish_id WHERE c.session_id = $1`, session)
	if err != nil {
		return cart, err
	}

	for rows.Next() {
		var item model.CartItem
		err = rows.Scan(&item.ID, &item.Dish, &item.Quantity)
		if err != nil {
			return cart, fmt.Errorf("scan failed: %v", err)
		}
		cartItems = append(cartItems, item)
	}
	cart = model.CartItems{cartItems}

	return cart, nil
}
