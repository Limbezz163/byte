package database

import (
	"context"
)

func GetDishIdOfCart(dishName string) int {
	dbpoll := ConnectDataBase()

	defer dbpoll.Close()

	var id int

	dbpoll.QueryRow(context.Background(), `SELECT id FROM "menu" WHERE dish_name = $1`, dishName).Scan(id)
	return id
}
