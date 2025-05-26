package model

type CartItem struct {
	ID        int    `json:"id"`
	SessionID string `json:"session_id"`
	Dish      string `json:"dish"`
	Quantity  int    `json:"quantity"`
}
