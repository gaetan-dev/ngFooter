angular.module("config", [])

.constant("ENV", {
	"name": "dev",
	"api": {
		"URL": "http://uc431000vw7net:1337/",
		"USER_URL": "http://uc431000vw7net:1337/user/",
		"AVAILABILITY_URL": "http://uc431000vw7net:1337/availability/",
		"EVENT_URL": "http://uc431000vw7net:1337/event/"
	}
})

;