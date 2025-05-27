package model

type Order struct {
	OrderId     string   `json:"order_id"`
	DelivertMen int      `json:"delivert_men"`
	Status      string   `json:"status"`
	Dishes      []string `json:"dishes"`
	UserId      int      `json:"user_id"`
}
