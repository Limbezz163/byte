package model

type RegisterResponse struct {
	User        User   `json:"user"`
	AccessToken string `json:"access_token"`
}
