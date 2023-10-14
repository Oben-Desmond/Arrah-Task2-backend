const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const app = express()
const schema = require("./schema/schema")
const cors = require("cors");
const Product = require("./models/ProductModel");

//add middle wears
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))

app.use(cors())


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

//add routes
app.get("/", (req, res) => {
    res.send("Server Running :)")
})

app.get("/add-products", async (req, res) => {
    for (let i = 1; i < 502; i++) {
        const product = new Product({
            name: `Product ${i}`,
            amount: (Math.random() * 100000) % 100000,
            currency: 'CFA',
            imageUrl: 'https://picsum.photos/1000/800'
        });

        await product.save();
        console.log(`saved product ${i}`);
    }
    res.send("Products added successfully")
})

//start server
const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})