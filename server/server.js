import { masterProductList } from './data.js'

import {} from 'dotenv/config'

import express from 'express'
const app = express()
import cors from 'cors'
app.use(express.json())
app.use(
  cors({
    // specify where will the server receive request from
    origin: 'https://angelchengsk.github.io'
    // origin: 'http://localhost:5500'
  })
)

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map(
  // Map object holds key-value pairs
  masterProductList.map((item) => {
    return [item.id, item]
  })
)

app.post('/get-master-product-list', async (req, res) => {
  try {
    res.json(masterProductList)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(Number(item.id))
        return {
          price_data: {
            currency: 'cad',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.price * 100
            // stripe requires the price to be in cent
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.CLIENT_URL}/index.html`,
      cancel_url: `${process.env.CLIENT_URL}/index.html`
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000)
