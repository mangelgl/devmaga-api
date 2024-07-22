# Install Dependencies

```
npm i
```

# Run the Application

Once dependencies have installed, run the following command:

```
npm run dev
```

# Seeders

To fill the database with data, run the following command:

```
node seeder --import
```

You can use the flag `-i` too.

To destroy the data, run the following command:

```
node seeder --delete
```

You can use the flag `-d` too.

# Commit Content

1. Initial Express setup
2. Using Express Routes
3. Creating Controller Methods to Routes
4. Intro to Middlewares
5. Connecting to Mongo Atlas Database & Paintint Colors on console logs
6. Creating first Model
7. Create Bootcamp - POST
8. Fetching Bootcamps - GET
9. Updating & Deleting Bootcamps - PUT & DELETE
10. Error handling
11. Async/Await Middleware
12. Slugify the name for url for better SEO
13. GeoJSON
14. Database Seeders
15. Get Bootcamps By Radius - GET
16. Advanced Filtering
17. Select, Sort & Pagination
18. Course Model & Seeder
19. Course Routes & Controller
20. Populate, Virtuals & Cascade Delete
21. Add, Update & Delete Course - POST PUT PATCH
22. Aggregate - Calculating Average Course Cost
23. File Uploads
24. Advanced Results (Select, Pagination, Sorting) in Middleware

# NPM Packages

- express - https://www.npmjs.com/package/express
- dotenv - https://www.npmjs.com/package/dotenv
- morgan - https://www.npmjs.com/package/morgan
- mongoose - https://www.npmjs.com/package/mongoose
- colors - https://www.npmjs.com/package/colors
- slugify - https://www.npmjs.com/package/slugify
- node-geocoder - https://www.npmjs.com/package/node-geocoder
- fileupload - https://www.npmjs.com/package/express-fileupload

# Information Links

- Async/Await Middlewares in Express - https://www.acuriousanimal.com/blog/20180315/express-async-middleware
- Mongoose Radius Filtering - https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/
- Mongoose Quantity Filtering - https://www.mongodb.com/docs/manual/reference/operator/query/gt/
- Mongoose Select Fields - https://mongoosejs.com/docs/queries
