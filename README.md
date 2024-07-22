# Simple REST API

This is a learning project <br/>
which is a simple REST API that allows you to create, read, update and delete users from MongoDB.

created using `Node.js` and `Express`.

## Installation

1. Clone the repository
2. Install the dependencies

```bash
npm install
```

3. Run the server

```bash
npm start
```

## Usage

### Get all users

```http
GET /users
```

### Get a single user

```http
GET /users/:id
```

### Create a user

```http
POST /users
```

```json
{
  "username": "John Doe",
  "email": "johndoe@example.com",
  "password": "123"
}
```

### Update a user

```http
PATCH /users/:id
```

```json
{
  "username": "Jane Doe"
}
```

### Delete a user

```http
DELETE /users/:id
```

## Todo

- [x] Create a simple REST API
- [x] Add authentication
- [x] Add a database
- [x] Add tests
- [ ] Add Docker support
- [ ] Add CI/CD
- [x] Add documentation
- [ ] Add more features
