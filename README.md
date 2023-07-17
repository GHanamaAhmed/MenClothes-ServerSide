# friha-server
decumentation:
## 1-Route: /products

### 1-Method: GET

Description: Retrieve a list of products.

Parameters:

min (optional): Specifies the minimum value for filtering products based on the arrangement. (Type: number)
max (optional): Specifies the maximum value for filtering products based on the arrangement. (Type: number)
Example Request:
GET /products?min=10&max=50

### 2-Method: POST

Description: Insert Product.

body:
name (required): Specifies the name of the product as a string with a maximum length of 100 characters.
reelId: Specifies the reel ID associated with the product. It should be an object ID.
quantity: Specifies the quantity of the product as a number, with a minimum value of 0.
price: Specifies the price of the product as a number.
details: Specifies an array of details related to the product. Each detail should be an object following the structure defined in the details schema.
photos: Specifies files type of data for the product's photos.
thumbnail: Specifies file type of data for the product's thumbnail.
promotion: Specifies the promotion value for the product as a number.
description: Specifies the description of the product as a string.
status: Specifies the status of the product as a boolean value.
showPrice: Specifies whether to show the price of the product as a boolean value.
showPromotion: Specifies whether to show the promotion of the product as a boolean value.
#### Schema: details
sizes: Specifies an array of sizes related to the product.
colors: Specifies an array of colors related to the product.
Example Request:

POST /products

{
  "name": "Example Product",
  "reelId": "6123456789abcdef0123456",
  "quantity": 10,
  "price": 29.99,
  "details": [{
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue", "Green"]
  },...],
  "photos":[ "base64-encoded-image-data",...],
  "thumbnail": "base64-encoded-image-data",
  "promotion": 0.1,
  "description": "This is an example product.",
  "status": true,
  "showPrice": true,
  "showPromotion": false
}
### 3-Method: PUT
Description: update product
body:
id (required): Specifies the ID of the object to be updated. It is expected to be an object ID.
name: Specifies the name of the product as a string with a maximum length of 100 characters.
reelId: Specifies the reel ID associated with the product. It should be an object ID.
quantity: Specifies the quantity of the product as a number, with a minimum value of 0.
price: Specifies the price of the product as a number.
details: Specifies an array of details related to the product. Each detail should be an object following the structure defined in the details schema.
photos: Specifies any type of data for the product's photos.
thumbnail (required): Specifies any type of data for the product's thumbnail.
promotion: Specifies the promotion value for the product as a number.
description: Specifies the description of the product as a string.
status: Specifies the status of the product as a boolean value.
showPrice: Specifies whether to show the price of the product as a boolean value.
showPromotion: Specifies whether to show the promotion of the product as a boolean value.
Body:
POST /products

{
  "id":"Id product"
  "name": "Example Product",
  "reelId": "6123456789abcdef0123456",
  "quantity": 10,
  "price": 29.99,
  "details": {
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue", "Green"]
  },
  "photos": "base64-encoded-image-data",
  "thumbnail": "base64-encoded-image-data",
  "promotion": 0.1,
  "description": "This is an example product.",
  "status": true,
  "showPrice": true,
  "showPromotion": false
}


### 1-Method: DELETE

Description: Delete product.

Body:

id (required): Specifies the ID of the object to be deleted. It is expected to be an object ID.

Example Request:
DELETE /products
{
id:"Id Product"
}


