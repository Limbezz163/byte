package model

type Address struct {
	Id        int    `json:"id"`
	City      string `json:"city"`
	Street    string `json:"street"`
	House     string `json:"house"`
	Apartment string `json:"apartment"`
}
