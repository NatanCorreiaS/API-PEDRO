# INSTRUÇÕES PARA A MANIPULAÇÃO DO PROJETO

1. O presente projeto foi programado em TypeScript, mas possui scripts para sua compilação em JavaScript caso necessário.
2. Primeiro certifique-se de ter todas as dependências do programa instalados, para isso utilize o comando `npm i` que irá automaticamente fazer o download de todas as dependências necessárias baseado no package.json.
3. Com base nos scripts que fiz para executar o programa, existem 3 scripts: dev, build e start.
4. `npm run dev` Irá executar um script com nodemon, é um pacote que permite hot-reload do programa a cada vez que uma alteração é feita no código, recomendo utilizar esse script.
5. `npm run build` Vai compilar o código TypeScript para JavaScript, mas não irá executa-lo.
6. `npm run start` Vai executar o código JavaScript, porém precisa ser compilado primeiro com `npm run build`.
7. A memória persistente do projeto se baseia em um arquivo .json chamado **chart.json**, não apague ele sob quaisquer circunstâncias.

## CRUD

1. O projeto utiliza de requisitos de parâmetros e requisitos de corpo de conteúdo(JSON).
2. MÉTODO GET para visualizar todos os produtos do carrinho, utilize o endereço `http://localhost:8000/api/`.
3. MÉTODO GET para visualizar apenas uma compra específica do carrinho, nesta será utilizada requisitos de parâmetro com a propriedade do id, como por exemplo `http://localhost:8000/api/{id}`, substituindo o `{id}`por um número que corresponda a um produto do carrinho.
4. MÉTODO POST para criar um produto e coloca-lo no carrinho, o endereço é `http://localhost:8000/api` , nesta será utilizada requisitos de corpo, da seguinte maneira:
```json
[
    // Exemplo
    {
        "id": 68,
        "productName": "Porta de aço",
        "price": 250.99,
        "quantity": 1
    }
    // Sendo id o identificador, productName o nome do produto, price o preço, quantity a quantidade
]
```
5. MÉTODO PUT para atualizar os dados de um produto, será utilizado tanto os requisitos de parâmetros como os requisitos de corpo neste método, o endereço é `http://localhost:8000/api/{id}`, substituindo o `{id}`pelo identificador do produto, em seguida deve-se definir as propriedades que serão atualizadas no corpo da requisição como:
```json
[
    // Exemplo
    {
        "id": 68,
        "productName": "Porta de madeira",
        "price": 123.57,
        "quantity": 1
    }
    // Sendo id o identificador, productName o nome do produto, price o preço, quantity a quantidade
]
```
6. MÉTODO DELETE, será utilizado somente os requisitos de parâmetros como no método GET para solicitar somente um produto, utiliza-se o endereço `http://localhost:8000/api/{id}`, substitua o `{id}`pelo identificador do produto, o produto será deletado e receberá uma mensagem de sucesso ou falha.