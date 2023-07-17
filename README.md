# friha-server
decumentation:
## 1-Route: /products

### 1-Method: GET

Description: Retrieve a list of products.<br />

Parameters:<br />

min (optional): Specifies the minimum value for filtering products based on the arrangement. (Type: number)<br />
max (optional): Specifies the maximum value for filtering products based on the arrangement. (Type: number)<br />
Example Request:<br />
GET /products?min=10&max=50<br />

### 2-Method: POST

Description: Insert Product.<br />

body:<br />
name (required): Specifies the name of the product as a string with a maximum length of 100 characters.<br />
reelId: Specifies the reel ID associated with the product. It should be an object ID.<br />
quantity: Specifies the quantity of the product as a number, with a minimum value of 0.<br />
price: Specifies the price of the product as a number.<br />
details: Specifies an array of details related to the product. Each detail should be an object following the structure defined in the details schema.<br />
photos: Specifies files type of data for the product's photos.<br />
thumbnail: Specifies file type of data for the product's thumbnail.<br />
promotion: Specifies the promotion value for the product as a number.<br />
description: Specifies the description of the product as a string.<br />
status: Specifies the status of the product as a boolean value.<br />
showPrice: Specifies whether to show the price of the product as a boolean value.<br />
showPromotion: Specifies whether to show the promotion of the product as a boolean value.<br />
#### Schema: details
sizes: Specifies an array of sizes related to the product.<br />
colors: Specifies an array of colors related to the product.<br />
Example Request:<br />

POST /products<br />

{<br />
  "name": "Example Product",<br />
  "reelId": "6123456789abcdef0123456",<br />
  "quantity": 10,<br />
  "price": 29.99,<br />
  "details": [{<br />
    "sizes": ["S", "M", "L"],<br />
    "colors": ["Red", "Blue", "Green"]<br />
  },...],<br />
  "photos":[ "base64-encoded-image-data",...],<br />
  "thumbnail": "base64-encoded-image-data",<br />
  "promotion": 0.1,<br />
  "description": "This is an example product.",<br />
  "status": true,<br />
  "showPrice": true,<br />
  "showPromotion": false<br />
}<br />
### 3-Method: PUT
Description: update product<br />
body:<br />
id (required): Specifies the ID of the object to be updated. It is expected to be an object ID.<br />
name: Specifies the name of the product as a string with a maximum length of 100 characters.<br />
reelId: Specifies the reel ID associated with the product. It should be an object ID.<br />
quantity: Specifies the quantity of the product as a number, with a minimum value of 0.<br />
price: Specifies the price of the product as a number.<br />
details: Specifies an array of details related to the product. Each detail should be an object following the structure defined in the details schema.<br />
photos: Specifies any type of data for the product's photos.<br />
thumbnail (required): Specifies any type of data for the product's thumbnail.<br />
promotion: Specifies the promotion value for the product as a number.<br />
description: Specifies the description of the product as a string.<br />
status: Specifies the status of the product as a boolean value.<br />
showPrice: Specifies whether to show the price of the product as a boolean value.<br />
showPromotion: Specifies whether to show the promotion of the product as a boolean value.<br />
Body:<br />
POST /products<br />

{<br />
  "id":"Id product"<br />
  "name": "Example Product",<br />
  "reelId": "6123456789abcdef0123456",<br />
  "quantity": 10,<br />
  "price": 29.99,<br />
  "details": {<br />
    "sizes": ["S", "M", "L"],<br />
    "colors": ["Red", "Blue", "Green"]<br />
  },<br />
  "photos": "base64-encoded-image-data",<br />
  "thumbnail": "base64-encoded-image-data",<br />
  "promotion": 0.1,<br />
  "description": "This is an example product.",<br />
  "status": true,<br />
  "showPrice": true,<br />
  "showPromotion": false<br />
}<br />


### 3-Method: DELETE

Description: Delete product.<br />

Body:<br />

id (required): Specifies the ID of the object to be deleted. It is expected to be an object ID.<br />

Example Request:<br />
DELETE /products<br />
{<br />
id:"Id Product"<br />
}<br />


