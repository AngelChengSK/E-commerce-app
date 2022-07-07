const masterProductList = [
  {
    id: 1,
    name: 'vase set',
    category: 'home decor, new arrivals',
    price: 15.99,
    img: 'images/vase-set.jpg'
  },
  {
    id: 2,
    name: 'floor lamp',
    category: 'lighting, new arrivals',
    price: 15.99,
    img: 'images/floor-lamp.jpeg'
  },
  {
    id: 3,
    name: 'brown sofa',
    category: 'sofas',
    price: 15.99,
    img: 'images/sofa-brown.jpg'
  },
  {
    id: 4,
    name: 'green sofa',
    category: 'sofas',
    price: 15.99,
    img: 'images/sofa-green.jpg'
  },
  {
    id: 5,
    name: 'round mirror',
    category: 'mirror',
    price: 15.99,
    img: 'images/round-mirror.jpg'
  }
]


// homepage
const navBar = document.querySelector('[data-nav-bar]')
const newArrivalsContainer = document.querySelector(
  '[data-new-arrivals-container]'
)

// shop page
const searchInput = document.querySelector('[data-search-products]')
const searchInputClear = document.querySelector('[data-clear-search]')
const categoryBtnsContainer = document.querySelector('[data-category-list]')
const viewAllBtn = document.querySelector('[data-category="view all"]')
const productsContainer = document.querySelector('[data-products-container]')
const shoppingCartBtn = document.querySelector('[data-shopping-cart-btn]')
const shoppingCartPage = document.querySelector('[data-shopping-cart-page]')
const shoppingCartItemsContainer = document.querySelector(
  '[data-shopping-cart-items-container]'
)
const shoppingCartTotalAmount = document.querySelector(
  '[data-total-cart-amount]'
)

let shoppingCartList = []

const app = {
  init: () => {
    document.addEventListener('DOMContentLoaded', app.loadPage)
  },
  loadPage: () => {
    let page = document.body.id
    switch (page) {
      case 'homepage':
        window.onscroll = () => {
          if (window.pageYOffset > 0) {
            navBar.classList.add('white-background')
          } else {
            navBar.classList.remove('white-background')
          }
        }
        app.renderNewArrivals()
        shoppingCartBtn.addEventListener('click', app.toggleShoppingCart)
        shoppingCartPage.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-edit-quantity')) {
            app.editQuantity(e)
          }
          if (e.target.hasAttribute('data-remove-cart-item')) {
            app.removeCartItem(e)
          }
        })
        newArrivalsContainer.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-add-to-cart-btn')) {
            app.addItemToCart(e.target.parentElement.parentElement.dataset.id)
            shoppingCartPage.classList.add('show')
          }
        })
        break
      case 'shop-page':
        app.loadShopPage()

        searchInput.addEventListener('keyup', (e) => {
          e.preventDefault()
          app.showSearchResult(e)
        })
        searchInputClear.addEventListener('click', () => {
          app.loadShopPage()
          searchInput.classList.remove('active')
        })
        shoppingCartBtn.addEventListener('click', app.toggleShoppingCart)
        shoppingCartPage.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-edit-quantity')) {
            app.editQuantity(e)
          }
          if (e.target.hasAttribute('data-remove-cart-item')) {
            app.removeCartItem(e)
          }
        })
        productsContainer.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-add-to-cart-btn')) {
            app.addItemToCart(e.target.parentElement.dataset.id)
            shoppingCartPage.classList.add('show')
          }
        })
        categoryBtnsContainer.addEventListener('click', app.selectCategory)
        break
    }
  },
  renderNewArrivals: () => {
    const newArrivalList = masterProductList.filter((newArrival) => {
      return newArrival.category.includes('new arrivals')
    })
    const html = newArrivalList
      .map((newArrival) => {
        return `
            <div class="new-arrival product" data-id=${newArrival.id}>
              <div class="new-arrival product-image">
                <img src="${newArrival.img}" alt="${newArrival.name}" />
                <i class="fa-solid fa-cart-plus" data-add-to-cart-btn></i>
              </div>
              <div class="new-arrival product-info">
                <div class="new-arrival product-name">${newArrival.name} set</div>
                <div class="new-arrival product-price">${newArrival.price}</div>
              </div>
            </div>
      `
      })
      .join('')
    newArrivalsContainer.innerHTML = html
  },
  loadShopPage: () => {
    app.renderProductList(masterProductList)
    viewAllBtn.classList.add('active')
    searchInput.value = ''
  },
  renderProductList: (productList) => {
    let html = productList.map((product) => {
      return `
            <div class="product-list product">
              <div class="product-list product-image" data-id="${product.id}">
                <img src=${product.img} alt=${product.name} />
                <i class="fa-solid fa-cart-plus" data-add-to-cart-btn></i>
              </div>
              <div class="product-list product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
              </div>
            </div>
      `
    })
    productsContainer.innerHTML = html.join('')
  },
  showSearchResult: (e) => {
    const searchPhase = e.target.value

    if (searchPhase == null || searchPhase == '') {
      app.renderProductList(masterProductList)
      searchInput.classList.remove('active')
      viewAllBtn.classList.add('active')
    } else {
      const filteredProductList = masterProductList.filter((product) => {
        return product.name.includes(searchPhase.toLowerCase().trim())
      })

      app.renderProductList(filteredProductList)
      searchInput.classList.add('active')

      const selectedCategory = document.querySelector('.active[data-category]')

      if (selectedCategory) {
        selectedCategory.classList.remove('active')
      }
    }
  },
  toggleShoppingCart: () => {
    shoppingCartPage.classList.toggle('show')
  },
  addItemToCart: (id) => {
    const inCartAlready = shoppingCartList.find(
      (cartItem) => cartItem.id === Number(id)
    )
    if (inCartAlready) {
      inCartAlready.quantity += 1
    } else {
      const selectedItem = masterProductList.find(
        (product) => product.id === Number(id)
      )
      const newItem = selectedItem
      newItem.quantity = 1
      shoppingCartList.push(newItem)
    }
    app.renderShoppingCart()
  },
  editQuantity: (e) => {
    const selectedItemId = e.target.parentElement.parentElement.dataset.id
    const selectedItem = shoppingCartList.find(
      (item) => item.id == selectedItemId
    )

    if (selectedItem.quantity === 1 && e.target.dataset.editQuantity === '-1')
      return

    // Function constructor
    selectedItem.quantity = Function(
      `return ${selectedItem.quantity + e.target.dataset.editQuantity}`
    )()
    app.renderShoppingCart()
  },
  removeCartItem: (e) => {
    const selectedItemId = e.target.parentElement.parentElement.dataset.id
    shoppingCartList = shoppingCartList.filter(
      (item) => item.id !== Number(selectedItemId)
    )
    app.renderShoppingCart()
  },
  renderShoppingCart: () => {
    app.renderCartItem()
    app.updateCartItemNumber()
    app.updateTotalAmount()
  },
  renderCartItem: () => {
    const html = shoppingCartList.map((cartItem) => {
      return `
      <div class="shopping-cart-item-container" data-id=${cartItem.id}>
        <img src="${cartItem.img}" alt="${cartItem.name}" />
        <div class="shopping-cart-item-info">
          <div class="shopping-cart-item-name">${cartItem.name}</div>
          <div class="shopping-cart-item-remove" data-remove-cart-item>remove</div>
        </div>
        <div class="shopping-cart-item-quantity-container">
          <i class="fa-solid fa-minus" data-edit-quantity="-1"></i>
          <div class="shopping-cart-item-quantity-amount">${cartItem.quantity}</div>
          <i class="fa-solid fa-plus" data-edit-quantity="+1"></i>
        </div>
        <div class="sub-total">${cartItem.price}</div>
      </div>
    `
    })
    shoppingCartItemsContainer.innerHTML = html.join('')
  },
  updateCartItemNumber: () => {
    if (shoppingCartList.length === 0) {
      shoppingCartBtn.innerText = `cart(0)`
    } else {
      const totalCartItem = shoppingCartList
        .map((item) => {
          return item.quantity
        })
        .reduce((sum, quantity) => sum + quantity)
      shoppingCartBtn.innerText = `cart(${totalCartItem})`
    }
  },
  updateTotalAmount: () => {
    if (shoppingCartList.length === 0) {
      shoppingCartTotalAmount.innerText = '$0.00'
    } else {
      const cartTotalAmount = shoppingCartList
        .map((item) => {
          return item.price * item.quantity
        })
        .reduce((sum, amount) => sum + amount)
      shoppingCartTotalAmount.innerText = cartTotalAmount
    }
  },
  selectCategory: (e) => {
    const isCategoryBtn = e.target.hasAttribute('data-category')
    if (!isCategoryBtn) return

    const selectedCategory = e.target.dataset.category

    if (selectedCategory === 'view all') {
      app.renderProductList(masterProductList)
    } else {
      const filteredProductList = masterProductList.filter((product) => {
        return product.category.includes(selectedCategory)
      })
      app.renderProductList(filteredProductList)
    }

    const isActive = e.target.classList.contains('active')

    if (!isActive) {
      const previousSelectedCategory = document.querySelector(
        '.active[data-category]'
      )

      previousSelectedCategory.classList.remove('active')
      e.target.classList.add('active')
    }
  }
}

app.init()
