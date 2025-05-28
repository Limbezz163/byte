package model

type Order struct {
	OrderId     string   `json:"order_id"`
	DelivertMen int      `json:"delivery_men"`
	Status      string   `json:"status"`
	Dishes      []string `json:"dishes"`
	UserId      int      `json:"user_id"`
}

type OrderPutStatus struct {
	OrderId string `json:"order_id"`
	Status  string `json:"status"`
}

type OrderPutDeliveryMen struct {
	OrderId     string `json:"order_id"`
	DelivertMen int    `json:"delivery_men"`
}
