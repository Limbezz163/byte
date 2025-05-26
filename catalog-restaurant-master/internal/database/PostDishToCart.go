package database

import (
	"catalog-restaurant/internal/model"
	"context"
	"fmt"
)

func PostDishToCart(session string, dish string, quantity int) (model.CartItem, error) {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	var cartItem model.CartItem

	// Проверяем, есть ли уже такое блюдо в корзине у этой сессии
	err := dbpool.QueryRow(
		context.Background(),
		`SELECT id, quantity FROM cart 
         WHERE session_id = $1 
         AND dish_id = (SELECT id FROM menu WHERE dish_name = $2)`,
		session, dish,
	).Scan(&cartItem.ID, &cartItem.Quantity)

	if err == nil {
		// Если запись найдена,то обновляем количество
		err = dbpool.QueryRow(
			context.Background(),
			`UPDATE cart 
             SET quantity = quantity + $1 
             WHERE id = $2 AND session_id = $3
             RETURNING id, session_id, (SELECT dish_name FROM menu WHERE id = dish_id), quantity`,
			quantity, cartItem.ID, session,
		).Scan(&cartItem.ID, &cartItem.SessionID, &cartItem.Dish, &cartItem.Quantity)

		if err != nil {
			return model.CartItem{}, fmt.Errorf("failed to update cart: %v", err)
		}

		return cartItem, nil
	}

	// Если записи нет, добавляем новую
	err = dbpool.QueryRow(
		context.Background(),
		`INSERT INTO cart (session_id, dish_id, quantity) 
         VALUES ($1, (SELECT id FROM menu WHERE dish_name = $2), $3) 
         RETURNING id, session_id, (SELECT dish_name FROM menu WHERE id = dish_id), quantity`,
		session, dish, quantity,
	).Scan(&cartItem.ID, &cartItem.SessionID, &cartItem.Dish, &cartItem.Quantity)

	if err != nil {
		return model.CartItem{}, fmt.Errorf("failed to insert into cart: %v", err)
	}

	return cartItem, nil
}
