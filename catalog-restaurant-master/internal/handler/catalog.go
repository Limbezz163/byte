package handler

import (
	"catalog-restaurant/internal/database"
	"catalog-restaurant/internal/model"
	"catalog-restaurant/internal/pagination"
	"context"
	"encoding/json"
	"net/http"
	"strconv"
)

func GetDishsOfMenu(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	dbpool := database.ConnectDataBase()
	defer dbpool.Close()

	dishs := []model.Dish{}
	ch := make(chan map[int][]string)
	var (
		currentid int
	)

	go func() {
		rows, err := dbpool.Query(context.Background(), `SELECT * FROM get_dishes_with_categories_func()`)
		if err != nil {
			json.NewEncoder(w).Encode(model.ErrorMessage{ErrorMessage: err.Error(), Error: err.Error()})
		}
		defer rows.Close()

		categoryMapSlice := make(map[int][]string)

		for rows.Next() {
			var (
				id_dish  int
				category string
			)
			rows.Scan(&id_dish, &category)
			if id_dish != currentid && currentid != 0 {
				categoryMapSlice[id_dish] = []string{category}
			} else if currentid == 0 {
				currentid++
				categoryMapSlice[currentid] = []string{category}
			} else {
				categoryMapSlice[currentid] = append(categoryMapSlice[currentid], category)
			}
		}
		currentid = 1 // 1 т.к. 0 элемента нету и нам не нужно его снова куда-то добавлять
		ch <- categoryMapSlice
		close(ch)
	}()
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	limit, offset, total, err := pagination.Paginate(limit, offset, "menu")
	if err != nil {
		json.NewEncoder(w).Encode(model.ErrorMessage{ErrorMessage: err.Error(), Error: err.Error()})
	}

	rows, err := dbpool.Query(context.Background(), `SELECT * FROM get_paginated_data_menu($1,$2)`, limit, offset)
	if err != nil {
		json.NewEncoder(w).Encode(model.ErrorMessage{ErrorMessage: err.Error(), Error: err.Error()})
	}
	categoryMapSlice := <-ch
	defer rows.Close()
	for rows.Next() {
		var name, urlImage, description, typeCuisine string
		var id, weight int
		var price, calories float64

		rows.Scan(&id, &name, &description, &urlImage, &weight, &calories, &price, &typeCuisine)
		dishs = append(
			dishs,
			model.Dish{
				id,
				name,
				description,
				price,
				urlImage,
				categoryMapSlice[id],
				calories,
				weight,
				typeCuisine})

	}
	paginat := model.PaginationMenu{limit, offset, total}

	json.NewEncoder(w).Encode(model.PaginationMenuResponse{Info_Dishs: dishs, Pagination: paginat})

}

//func GetDish(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
//	dbpool := database.ConnectDataBase()
//	defer dbpool.Close()

//vars := mux.Vars(r)
//id, err := strconv.Atoi(vars["id"])
//if err != nil {
//	json.NewEncoder(w).Encode(model.ErrorMessage{ErrorMessage: err.Error(), Error: err.Error()})
//}
//var name, urlImage string
//var typeCuisine, category []string
//var id, weight int
//var price, calories float64
//
////dbpool.QueryRow(context.Background(), `SELECT name_dish,price,image_url FROM menu WHERE id = $1`, &id).Scan(&name, &price, &urlImage)
//
//json.NewEncoder(w).Encode(model.Dish{id, name, price, urlImage})
//}
