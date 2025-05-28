package database

import (
	"catalog-restaurant/internal/model"
	"context"
)

func AddOrder(order model.Order) (model.Order, error) {
	dpbool := ConnectDataBase()
	defer dpbool.Close()

	err := dpbool.QueryRow(context.Background(),
		`INSERT INTO "order" (users_id, id_delivery_men, status) 
         VALUES ($1, $2, $3) 
         RETURNING order_id`,
		order.UserId, order.DelivertMen, order.Status).Scan(&order.OrderId)

	if err != nil {
		return order, err
	}

	for _, dish := range order.Dishes {
		_, err = dpbool.Exec(context.Background(),
			`INSERT INTO "dishes_to_order" (order_id, dish_id) 
             SELECT $1, m.id FROM "menu" m WHERE m.dish_name = $2`,
			order.OrderId, dish)

		if err != nil {
			return order, err
		}
	}

	if err != nil {
		return order, err
	}

	return order, nil
}
