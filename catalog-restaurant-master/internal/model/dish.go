package model

// Блюдо в каталоге
type Dish struct {
	ID          int      `json:"id"`
	Name        string   `json:"dish_name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	ImageURL    string   `json:"image_url"`
	Category    []string `json:"category"`
	Calories    float64  `json:"calories"`
	Weight      int      `json:"weight"`
	TypeСuisine string   `json:"type_name"`
}
