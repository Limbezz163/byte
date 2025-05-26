package database

import (
	"context"
	"fmt"
)

// Функция принимает 2 аргументa. Она добавляет аргументы в таблицу "session"

func InsertSession(value string, userId int) error {
	dbpool := ConnectDataBase()
	defer dbpool.Close()
	if value == "" {
		err := fmt.Errorf("Строка value пустая")
		return err
	}

	_, err := dbpool.Exec(context.Background(), "INSERT INTO session (id,id_user) values($1,$2)", value, userId)
	if err != nil {
		return err
	}

	return nil
}
