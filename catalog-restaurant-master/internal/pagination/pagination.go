package pagination

import (
	"catalog-restaurant/internal/database"
	"context"
	"fmt"
)

func Paginate(limit, offset int, nameTable string) (int, int, int, error) {
	dbpool := database.ConnectDataBase()
	defer dbpool.Close()

	if offset < 0 {
		offset = 0
	}

	var count int

	query := fmt.Sprintf("SELECT COUNT(*) FROM %s", nameTable)
	err := dbpool.QueryRow(context.Background(), query).Scan(&count)
	if err != nil {
		return limit, offset, count, err
	}

	if limit < 0 {
		limit = count
	}

	if count < offset || count < limit+offset {
		err = fmt.Errorf("Offset или Limit привышает Total")
		return limit, offset, count, err
	}

	return limit, offset, count, nil
}
