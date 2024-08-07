# BUGUER CAR API

## Tecnologias utilizadas
**Node.js, Typescript, Eslint, Prisma, Express, Docker**

## Iniciar aplicação
Para inciar a aplicação e necessario ter docker e docker-compose instalado em sua maquina.
Apos instalado o docker e docker-compose basta rodar o seguinte comando em seu terminal:
`docker-compsoe up`
e voce tera todas as seguintes rotas funcionando perfeitamente:
## Rotas
- **PRODUCT**
    - GET /products
    - GET /products/<text search | id>
    - POST /products
        - **Body sample:**`"descricao": "",	"estoqueInicial": 0, "custo": 0, "preco": 0`  
    - DELETE /products/<id>
    - PUT /products/price/<id>
        - **Body sample:** `"price": 0`   
    - PUT /products/ean/<id>
        - **Body sample:** `"ean": ""` 
    - PUT /products/balance/<id>
        - **Body sample:** `"balance": 0`
    - PUT /products/offer/<id>
        - **Body sample:** `"offer": 0` 
- **RECIPE**
    - GET /recipe
    - GET /recipe/<text search | id>
    - POST /recipe
        - **Body sample:** `"descricao": ""` 
    - PUT /recipe/<id>
        - **Body sample:** `"descricao": ""`
    - DELETE /recipe/<id>
- **RECIPE ITEM**
    - POST /recipe/<Recipe ID>/product/<Product ID>
        - **Body sample:** `"quantidade": 0`
    - DELETE /recipe/recipeItem/<Recipe Item ID>
