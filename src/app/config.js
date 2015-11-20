angular.module("config", [])

.constant("ENV", {
	"name": "prod",
	"api": {
		"URL": "http://dvafavmodweb32:91/",
		"USER_URL": "http://dvafavmodweb32:91/user/",
		"AVAILABILITY_URL": "http://dvafavmodweb32:91/availability/",
		"EVENT_URL": "http://dvafavmodweb32:91/event/"
	}
})

;