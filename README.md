# Threads Clone

- Created: Dec 8, 2024

### Stack

- Remix
- Drizzle
- Sqlite
- Uploadthing

### Installation

```bash
npm install
npm run dev


# npx drizzle-orm
# npx -D drizzle-kit
npx drizzle-kit push
npx drizzle-kit studio
```

### Todo

- [x] Add validation on createThreadAction

- [x] Change the post btn ui the same as threads

- [x] Add logout functionality

- Add search functionality, make sure to

  - Search only threads that are not replies
  - Dont show thread actions

- Add repost functionality

---

#### Thoughts upon developing (probably irrelevant)

- Remix has a straightforward logic, only took me a few days to understand the concepts of Remix.

- I like drizzle better than prisma.

- They kinda stick to web standards, so it's easy to understand.

- No middlewares, so we have to check for user session in every route for security :<.
  > https://remix.run/docs/en/1.19.3/pages/faq#how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
