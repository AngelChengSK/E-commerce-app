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
    category: 'lighting',
    price: 15.99,
    img: 'images/floor-lamp.jpeg'
  },
  {
    id: 3,
    name: 'Brown sofa',
    category: 'sofas',
    price: 15.99,
    img: 'images/sofa-brown.jpg'
  },
  {
    id: 4,
    name: 'Green sofa',
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

const navBar = document.querySelector('[data-nav-bar]')
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

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

window.onscroll = () => {
  if (!navBar.classList.contains('homepage')) return

  if (window.pageYOffset > 0) {
    navBar.classList.add('white-background')
  } else {
    navBar.classList.remove('white-background')
  }
}

shoppingCartBtn.addEventListener('click', () => {
  shoppingCartPage.classList.toggle('show')
})

shoppingCartPage.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-edit-quantity')) {
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
    renderShoppingCart()
    return
  }

  if (e.target.hasAttribute('data-remove-cart-item')) {
    const selectedItemId = e.target.parentElement.parentElement.dataset.id
    shoppingCartList = shoppingCartList.filter(
      (item) => item.id !== Number(selectedItemId)
    )
    renderShoppingCart()
    return
  }
})

searchInput.addEventListener('keyup', (e) => {
  const searchPhase = e.target.value

  if (searchPhase == null || searchPhase == '') {
    renderProductList(masterProductList)
    searchInput.classList.remove('active')
    viewAllBtn.classList.add('active')
  } else {
    const filteredProductList = masterProductList.filter((product) => {
      return product.name.includes(searchPhase.toLowerCase().trim())
    })

    renderProductList(filteredProductList)
    searchInput.classList.add('active')

    const selectedCategory = document.querySelector('.active[data-category]')

    if (selectedCategory) {
      selectedCategory.classList.remove('active')
    }
  }
})

searchInputClear.addEventListener('click', () => {
  ready()
  searchInput.classList.remove('active')
})

categoryBtnsContainer.addEventListener('click', (e) => {
  const isCategoryBtn = e.target.hasAttribute('data-category')
  if (!isCategoryBtn) return

  const selectedCategory = e.target.dataset.category

  if (selectedCategory === 'view all') {
    renderProductList(masterProductList)
  } else {
    const filteredProductList = masterProductList.filter((product) => {
      return product.category.includes(selectedCategory)
    })
    renderProductList(filteredProductList)
  }

  const isActive = e.target.classList.contains('active')

  if (!isActive) {
    const previousSelectedCategory = document.querySelector(
      '.active[data-category]'
    )

    previousSelectedCategory.classList.remove('active')
    e.target.classList.add('active')
  }
})

productsContainer.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-add-to-cart-btn')) {
    addItemToCart(e.target.parentElement.dataset.id)
    shoppingCartPage.classList.add('show')
  }
})

function ready() {
  renderProductList(masterProductList)
  viewAllBtn.classList.add('active')
  searchInput.value = ''
}

function renderProductList(productList) {
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
}

function addItemToCart(id) {
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
  renderShoppingCart()
}

function renderShoppingCart() {
  renderCartItem()
  updateCartItemNumber()
  updateTotalAmount()
}

function renderCartItem() {
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
}

function updateCartItemNumber() {
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
}

function updateTotalAmount() {
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
}

