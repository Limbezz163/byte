package parsing

import (
	"fmt"
	"github.com/go-resty/resty/v2"
)

func GetInfoUser() {
	client := resty.New()

	// GET-запрос
	resp, err := client.R().
		SetHeader("Accept", "application/json").
		Get("http://localhost:8000/api/data")

	if err != nil {
		fmt.Printf("Ошибка: %v\n", err)
		return
	}
}
