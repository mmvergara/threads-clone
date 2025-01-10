Created: Dec 8, 2024

<h1 align="center">Threads Clone</h1>

<p align="center">
<img src="./screenshots/logo.png" height="200">
</p>

<p align="center">
Simple Threads Clone with Remix and Drizzle
</p>

---

### Todo

- Zod validation on routes

### Stack

- Remix
- Drizzle
- Sqlite
- Uploadthing

### Installation

Fill in the .env file with the correct values.
then

```bash
# Install dependencies
npm install

# Create local.db
touch local.db

# Push schema to local.db
npx drizzle-kit push

# Run
npm run dev

# Open studio for database visualization
npx drizzle-kit studio
```

---

### Screenshots

![Screenshot 1](./screenshots/1.png)
![Screenshot 2](./screenshots/2.png)
![Screenshot 3](./screenshots/3.png)
![Screenshot 4](./screenshots/4.png)
![Screenshot 5](./screenshots/5.png)
![Screenshot 6](./screenshots/6.png)
![Screenshot 7](./screenshots/7.png)
![Screenshot 8](./screenshots/8.png)
![Screenshot 9](./screenshots/9.png)

#### Thoughts upon developing (probably irrelevant)

- Remix has a straightforward logic, only took me a few days to understand the concepts of Remix.

- Tried implementing proper html semantics and accessibility like aria-labels, etc.

- I like drizzle better than prisma.

- They kinda stick to web standards, so it's easy to understand.

- No middlewares, so we have to check for user session in every route for authorization.
  > https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
