package database

import (
	"catalog-restaurant/internal/model"
	"context"
	"fmt"
)

func UpdateOrder(order model.OrderPutStatus) (model.OrderPutStatus, error) {
	dbpool := ConnectDataBase()
	defer dbpool.Close()

	result, err := dbpool.Exec(context.Background(), `UPDATE "order" SET status = $1 WHERE order_id = $2`, order.Status, order.OrderId)
	if err != nil {
		return order, err
	}

	// Проверяем, что была обновлена хотя бы одна строка
	if result.RowsAffected() == 0 {
		err = fmt.Errorf("order with id %v does not exist", order.OrderId)
		return order, err
	}

	return order, nil
}
