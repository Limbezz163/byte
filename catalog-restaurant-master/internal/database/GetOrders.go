package database

import (
	"catalog-restaurant/internal/model"
	"context"
	"strconv"
)

func GetOrder(idUser int) ([]model.Order, error) {
	dbpool := ConnectDataBase()

	var order model.Order
	var orders []model.Order
	var idUserstr string

	defer dbpool.Close()

	idUserstr = strconv.Itoa(idUser)

	rows, err := dbpool.Query(context.Background(),
		`SELECT order_id, id_delivery_men, status FROM "order" WHERE users_id = $1`, idUserstr)
	defer rows.Close()

	if err != nil {
		return orders, err
	}

	for rows.Next() {
		rows.Scan(&order.OrderId, &order.DelivertMen, &order.Status)

		dishes, _ := dbpool.Query(context.Background(),
			`select m.dish_name from "dishes_to_order" dto JOIN "menu" m ON dto.dish_id = m.id WHERE order_id = $1`, order.OrderId)

		var dishArr []string
		for dishes.Next() {
			var dish string

			dishes.Scan(&dish)

			dishArr = append(dishArr, dish)
		}

		order.Dishes = dishArr
		order.UserId = idUser

		orders = append(orders, order)
	}
	return orders, nil
}
