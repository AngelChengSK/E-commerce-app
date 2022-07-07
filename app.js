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
const searchBtn = document.querySelector('[data-search-btn]')
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

const LOCAL_STORAGE_SHOPPING_CART_LIST = 'mf-shopping-cart-list'

let shoppingCartList =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_SHOPPING_CART_LIST)) || []

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
        app.renderShoppingCart()
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
        app.renderShoppingCart()

        if (window.location.hash) {
          if (window.location.hash === '#search') app.showSearchSection()
          else {
            const selectedCategory = window.location.hash
              .slice(1)
              .replace(/%20/g, ' ')
            app.renderSelectedCategory(selectedCategory)
            app.toggleSelectedCategoryBtn(selectedCategory)
          }
          // remove the hash in the url
          history.replaceState(null, null, ' ')
        }
        searchBtn.addEventListener('click', app.showSearchSection)
        searchInput.addEventListener('keyup', (e) => {
          e.preventDefault()
          app.showSearchResult(e)
        })
        searchInputClear.addEventListener('click', () => {
          app.loadShopPage()
          searchInput.classList.remove('active')
          searchInput.focus()
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
        categoryBtnsContainer.addEventListener('click', (e) => {
          const isCategoryBtn = e.target.hasAttribute('data-category')
          if (!isCategoryBtn) return
          const selectedCategory = e.target.dataset.category
          app.renderSelectedCategory(selectedCategory)
          app.toggleSelectedCategoryBtn(selectedCategory)
        })
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
  showSearchSection: () => {
    searchInput.focus()
    productsContainer.innerHTML = '<div>Search for products</div>'
    const selectedCategory = document.querySelector('.active[data-category]')

    if (selectedCategory) {
      selectedCategory.classList.remove('active')
    }
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
    const isNavBarWhiteBackground =
      navBar.classList.contains('white-background')
    if (!isNavBarWhiteBackground) {
      navBar.classList.add('white-background')
    }
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
    app.save()
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
    app.save()
    app.renderShoppingCart()
  },
  removeCartItem: (e) => {
    const selectedItemId = e.target.parentElement.parentElement.dataset.id
    shoppingCartList = shoppingCartList.filter(
      (item) => item.id !== Number(selectedItemId)
    )
    app.save()
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
  renderSelectedCategory: (categoryName) => {
    if (categoryName === 'view all') {
      app.renderProductList(masterProductList)
    } else {
      const filteredProductList = masterProductList.filter((product) => {
        return product.category.includes(categoryName)
      })
      app.renderProductList(filteredProductList)
    }
  },
  toggleSelectedCategoryBtn: (categoryName) => {
    const targetCategoryBtn = document.querySelector(
      `[data-category="${categoryName}"]`
    )
    const isPreviousSelectedCategory =
      targetCategoryBtn.classList.contains('active')
    const previousSelectedCategory = document.querySelector(
      '.active[data-category]'
    )
    if (isPreviousSelectedCategory) return
    else if (previousSelectedCategory) {
      previousSelectedCategory.classList.remove('active')
      targetCategoryBtn.classList.add('active')
    } else {
      targetCategoryBtn.classList.add('active')
    }
  },
  save: () => {
    localStorage.setItem(
      LOCAL_STORAGE_SHOPPING_CART_LIST,
      JSON.stringify(shoppingCartList)
    )
  }
}

app.init()
