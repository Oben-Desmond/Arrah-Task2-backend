const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLID, GraphQLFloat } = require('graphql');
const mongoose = require("mongoose")
const Product = require("../models/ProductModel")


console.log("connecting")
mongoose.connect("mongodb+srv://obendesmond:obenDesmond1234@airbnb.ptdibjk.mongodb.net/")
mongoose.connection.once("open", () => {
    console.log("connected to database")
})

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
        currency: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        product: {
            type: ProductType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                return await Product.findById(args.id)
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            args: {
                page: {
                    type: GraphQLID
                }
            },
            resolve: async (parent, args) => {
                const page = args.page || 1;
                return await Product.find({}, null, { skip: (page - 1) * 10, limit: 10 });
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                imageUrl: { type: new GraphQLNonNull(GraphQLString) },
                amount: { type: new GraphQLNonNull(GraphQLInt) },
                currency: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                try {
                    let product = new Product({
                        name: args.name,
                        imageUrl: args.imageUrl,
                        amount: args.amount,
                        currency: args.currency
                    })
                    console.log(product)
                    return await product.save()
                } catch (err) {
                    console.error(err)
                    return err
                }
            }
        },
        deleteProduct: {
            type: ProductType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                return await Product.findByIdAndDelete(args.id)
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})


