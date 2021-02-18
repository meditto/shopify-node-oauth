dev:
	docker-compose up --build

test:
	docker-compose -f docker-compose.test.yml up --build

down:
	docker-compose down

prod:
	 docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build