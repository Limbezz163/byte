package database

import (
	"context"
	"fmt"
)

// Функция принимает 1 обязательный и 1 необязательный аргумент. Она добавляет аргументы в таблицу "session"

func InsertSession(value string, userId ...int) error {
	dbpool := ConnectDataBase()
	defer dbpool.Close()
	if value == "" {
		err := fmt.Errorf("Строка value пустая")
		return err
	}

	if len(userId) > 0 {
		var id int
		id = userId[0]
		_, err := dbpool.Exec(context.Background(), "INSERT INTO session (id,id_user) values($1,$2)", value, id)
		if err != nil {
			return err
		}
	} else {
		_, err := dbpool.Exec(context.Background(), "INSERT INTO session (id) values($1)", value)
		if err != nil {
			return err
		}
	}
	return nil
}
