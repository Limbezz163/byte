package model

type PaginationMenu struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
	Total  int `json:"total"`
}

type PaginationMenuResponse struct {
	Info_Dishs []Dish         `json:"data"`
	Pagination PaginationMenu `json:"meta"`
}
