// import { masterProductList } from '../client/data.js'

// setup dotenv, call the config() method to load our environment variables
require('dotenv').config()

const express = require('express')
const app = express()
// const cors = require('cors')

//the app will send information over json
//tell the app to use express.json() so to read all the json data that sent up to our server
app.use(express.json())

//if client and server running on different place,
//specify where will the app accept request from
// app.use(
//   cors({
//     origin: 'http://localhost:5500'
//   })
// )

//if client and server running on the same place,
//declare the folder of all static files, tell the app that all of the client - side code is living in the folder called public
app.use(express.static('public'))

//setup stripe, require stripe library, pass in our stripe key
//STRIPE_PRIVATE_KEY, can call it whatever you like, its the env variable which .env will create for us
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

// const storeItems = new Map(
//   // Map object holds key-value pairs
//   masterProductList.map((item) => {
//     return [item.id, item]
//   })
// )

const storeItems = new Map([
  [1, { priceInCents: 10000, name: 'Learn React Today' }],
  [2, { priceInCents: 10000, name: 'Learn CSS Today' }]
])

// app.post('/create-checkout-session', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: req.body.items.map((item) => {
//         const storeItem = storeItems.get(item.id)
//         return {
//           price_data: {
//             currency: 'cad',
//             product_data: {
//               name: storeItem.name
//             },
//             unit_amount: storeItem.priceInCents
//           },
//           quantity: item.quantity
//         }
//       // line_items: req.body.items.map((item) => {
//       //   const storeItem = storeItems.get(item.id)
//       //   return {
//       //     price_data: {
//       //       currency: 'cad',
//       //       product_data: {
//       //         name: storeItem.name
//       //       },
//       //       unit_amount: storeItem.price * 100
//       //       // stripe requires the price to be in cent
//       //     },
//       //     quantity: item.quantity
//       //   }
//       }),
//       success_url: `${process.env.CLIENT_URL}/index.html`,
//       cancel_url: `${process.env.CLIENT_URL}/index.html`
//     })
//     res.json({ url: session.url })
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//   }
// })

//app will listen on port 3000
app.listen(3000)

//when click on checkout, make a request to our server asking for the url to the checkout page
//how stripe works: send the product ids & quantity to the server, get the pricing from the server, use all those information to create a unique url for checkout process
