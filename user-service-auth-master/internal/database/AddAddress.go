package database

import (
	"context"
	"user-service/internal/model"
)

func AddAddress(address model.Address) (model.Address, error) {
	dbpool := ConnectDataBase()

	defer dbpool.Close()

	err := dbpool.QueryRow(context.Background(),
		`INSERT INTO "delivery_address" (city, street, house, apartment) 
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
		address.City, address.Street, address.House, address.Apartment).Scan(&address.Id)

	if err != nil {
		return address, err
	}
	return address, nil
}
