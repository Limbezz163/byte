package config

var JWTSecretKey = []byte{}

func Init() {
	JWTSecretKey = []byte("JWT_KEY_OF_AUTH")

	if len(JWTSecretKey) == 0 {
		panic("JWT secret key can't be empty")
	}
}
