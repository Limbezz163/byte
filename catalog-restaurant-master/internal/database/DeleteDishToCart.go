package database

import (
	"context"
	"fmt"
)

func DeleteDishToCart(session, dish string) error {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	_, err := dbpool.Exec(
		context.Background(),
		`DELETE FROM cart WHERE dish_id = (SELECT id FROM menu WHERE dish_name = $1) AND session_id = $2`,
		dish, session,
	)
	if err != nil {
		return fmt.Errorf("failed to delete cart item: %v", err)
	}
	return nil

	return nil
}
