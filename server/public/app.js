import { masterProductList } from './data.js'

// common elements
const navBar = document.querySelector('[data-nav-bar]')
const sidebarMenuBtn = document.querySelector('[data-sidebar-menu-btn]')
const sidebarMenuPage = document.querySelector('[data-sidebar-menu-page]')
const shoppingCartBtns = document.querySelectorAll('[data-shopping-cart-btn]')
const shoppingCartPage = document.querySelector('[data-shopping-cart-page]')
const shoppingCartItemsContainer = document.querySelector(
  '[data-shopping-cart-items-container]'
)
const shoppingCartTotalAmount = document.querySelector(
  '[data-total-cart-amount]'
)
const checkoutBtn = document.querySelector('[data-checkout-btn]')

// homepage elements
const navSearchInputForm = document.querySelector(
  '[data-nav-search-input-form]'
)
const navSearchInput = document.querySelector('[data-nav-search-input]')
const newArrivalsContainer = document.querySelector(
  '[data-new-arrivals-container]'
)
const shoppingCartNumberIcon = document.querySelector(
  '[data-shopping-cart-number-icon]'
)

// shop page elements
const searchBtn = document.querySelector('[data-search-btn]')
const searchInput = document.querySelector('[data-search-products]')
const searchInputClear = document.querySelector('[data-clear-search]')
const categoryBtnsContainer = document.querySelector('[data-category-list]')
const viewAllBtn = document.querySelector('[data-category="view all"]')
const productsContainer = document.querySelector('[data-products-container]')

// local storage key
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
        app.loadHomepage()

        window.onscroll = () => {
          if (window.pageYOffset > 0) {
            navBar.classList.add('white-background')
          } else {
            navBar.classList.remove('white-background')
          }
        }

        document.addEventListener('click', (e) => {
          if (
            e.target.closest('[data-homepage]') ||
            e.target.closest('footer')
          ) {
            shoppingCartPage.classList.remove('show')
            sidebarMenuPage.classList.remove('show')
            return
          }
          if (e.target.hasAttribute('data-sidebar-menu-btn')) {
            shoppingCartPage.classList.remove('show')
            return
          }
          if (e.target.hasAttribute('data-shopping-cart-btn')) {
            sidebarMenuPage.classList.remove('show')
            return
          }
        })
        sidebarMenuBtn.addEventListener('click', () => {
          app.toggleSidebarMenu()
          navSearchInput.value = ''
        })
        navSearchInputForm.addEventListener('submit', (e) => {
          e.preventDefault()
          if (navSearchInput.value === null || navSearchInput.value === '')
            return
          window.location.href = `shop.html#search${navSearchInput.value}`
        })
        shoppingCartBtns.forEach((btn) => {
          btn.addEventListener('click', app.toggleShoppingCart)
        })
        shoppingCartPage.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-edit-quantity')) {
            app.editQuantity(e)
          }
          if (e.target.hasAttribute('data-remove-cart-item')) {
            app.removeCartItem(e)
          }
        })
        checkoutBtn.addEventListener('click', app.checkout)
        newArrivalsContainer.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-add-to-cart-btn')) {
            app.addItemToCart(
              e.target.parentElement.parentElement.parentElement.dataset.id
            )
            app.updateQuantityInCartIcon()
          }
        })
        break
      case 'shop-page':
        app.loadShopPage()

        if (window.location.hash) {
          if (window.location.hash === '#search') app.showSearchSection()
          else if (window.location.hash.indexOf('search') == 1) {
            const searchPhase = window.location.hash
              .slice(7)
              .replace(/%20/g, ' ')
            app.showSearchSection()
            searchInput.value = searchPhase
            app.showSearchResult(searchPhase)
          } else {
            const selectedCategory = window.location.hash
              .slice(1)
              .replace(/%20/g, ' ')
            app.renderSelectedCategory(selectedCategory)
            app.toggleSelectedCategoryBtn(selectedCategory)
          }
          // remove hash and everything after the hash from the web page url
          history.replaceState(null, null, ' ')
        }
        document.addEventListener('click', (e) => {
          if (
            e.target.closest('[data-shop-page]') ||
            e.target.closest('footer')
          ) {
            shoppingCartPage.classList.remove('show')
            sidebarMenuPage.classList.remove('show')
            return
          }
          if (e.target.hasAttribute('data-sidebar-menu-btn')) {
            shoppingCartPage.classList.remove('show')
            return
          }
          if (e.target.hasAttribute('data-shopping-cart-btn')) {
            sidebarMenuPage.classList.remove('show')
            return
          }
        })
        sidebarMenuBtn.addEventListener('click', app.toggleSidebarMenu)
        searchBtn.addEventListener('click', app.showSearchSection)
        searchInput.addEventListener('keyup', (e) =>
          app.showSearchResult(e.target.value)
        )
        searchInputClear.addEventListener('click', () => {
          app.loadShopPage()
          searchInput.classList.remove('active')
          searchInput.focus()
        })
        shoppingCartBtns.forEach((btn) => {
          btn.addEventListener('click', app.toggleShoppingCart)
        })
        shoppingCartPage.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-edit-quantity')) {
            app.editQuantity(e)
          }
          if (e.target.hasAttribute('data-remove-cart-item')) {
            app.removeCartItem(e)
          }
        })
        checkoutBtn.addEventListener('click', app.checkout)
        productsContainer.addEventListener('click', (e) => {
          if (e.target.hasAttribute('data-add-to-cart-btn')) {
            app.addItemToCart(e.target.parentElement.parentElement.dataset.id)
            app.updateQuantityInCartIcon()
          }
        })
        categoryBtnsContainer.addEventListener('click', (e) => {
          const isCategoryBtn = e.target.hasAttribute('data-category')
          if (!isCategoryBtn) return
          const selectedCategory = e.target.dataset.category
          app.renderSelectedCategory(selectedCategory)
          app.toggleSelectedCategoryBtn(selectedCategory)

          if (searchInput.value) {
            searchInput.classList.remove('active')
            searchInput.value = ''
          }
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
            <div class="add-product-btn-container">
              <i class="fa-solid fa-cart-plus" data-add-to-cart-btn></i>
              <div class="quantity-in-cart" data-quantity-in-cart-icon></div>
            </div>
          </div>
          <div class="new-arrival product-info">
            <div class="new-arrival product-name">${newArrival.name}</div>
            <div class="new-arrival product-price">$${newArrival.price}</div>
          </div>
        </div>
        `
      })
      .join('')
    newArrivalsContainer.innerHTML = html
    app.updateQuantityInCartIcon()
  },
  loadHomepage: () => {
    app.renderShoppingCart()
    app.renderNewArrivals()
  },
  loadShopPage: () => {
    app.renderProductList(masterProductList)
    app.renderShoppingCart()
    viewAllBtn.classList.add('active')
    searchInput.value = ''
  },
  renderProductList: (productList) => {
    let html = productList.map((product) => {
      return `
      <div class="product-list product">
        <div class="product-list product-image" data-id="${product.id}">
          <img src=${product.img} alt=${product.name} />
          <div class="add-product-btn-container">
            <i class="fa-solid fa-cart-plus" data-add-to-cart-btn></i>
            <div class="quantity-in-cart" data-quantity-in-cart-icon></div>
          </div>
        </div>
        <div class="product-list product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-price">$${product.price}</div>
        </div>
      </div>
      `
    })
    productsContainer.innerHTML = html.join('')
    app.updateQuantityInCartIcon()
  },
  showSearchSection: () => {
    searchInput.focus()
    productsContainer.innerHTML = `
    <div class="search-notice">
      <div>Search for products</div>
    </div>
    `

    const selectedCategory = document.querySelector('.active[data-category]')

    if (selectedCategory) {
      selectedCategory.classList.remove('active')
    }
  },
  showSearchResult: (searchPhase) => {
    if (searchPhase === null || searchPhase === '') {
      app.renderProductList(masterProductList)
      searchInput.classList.remove('active')
      viewAllBtn.classList.add('active')
    } else {
      const filteredProductList = masterProductList.filter((product) => {
        return product.name.includes(searchPhase.toLowerCase().trim())
      })

      if (filteredProductList.length === 0) {
        productsContainer.innerHTML = `
        <div class="search-notice">
          <div class="search-no-results">There are no results for "${searchPhase}"</div>
          <div class="search-no-results-advice">Try again using a different spelling or keywords.</div>
        </div>
        `
      } else {
        app.renderProductList(filteredProductList)
      }

      searchInput.classList.add('active')

      const selectedCategory = document.querySelector('.active[data-category]')

      if (selectedCategory) {
        selectedCategory.classList.remove('active')
      }
    }
  },
  toggleSidebarMenu: () => {
    sidebarMenuPage.classList.toggle('show')
    const isNavBarWhiteBackground =
      navBar.classList.contains('white-background')
    if (!isNavBarWhiteBackground) {
      navBar.classList.add('white-background')
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
    const inCartAlready = shoppingCartList.find((cartItem) => cartItem.id == id)
    if (inCartAlready) {
      inCartAlready.quantity += 1
    } else {
      const newItem = {
        id: id,
        quantity: 1
      }
      shoppingCartList.push(newItem)
    }
    app.save()
    app.renderShoppingCart()
  },
  updateQuantityInCartIcon: () => {
    const quantityInCartIcons = document.querySelectorAll(
      '[data-quantity-in-cart-icon]'
    )
    const shoppingCartProductIDs = shoppingCartList.map((item) =>
      item.id.toString()
    )

    quantityInCartIcons.forEach((icon) => {
      const productId = icon.closest('[data-id]').dataset.id

      if (shoppingCartProductIDs.includes(productId)) {
        const product = shoppingCartList.find((item) => item.id == productId)

        icon.innerText = product.quantity
        icon.classList.add('show')
      } else {
        icon.innerText = 0
        icon.classList.remove('show')
      }
    })
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
    app.updateQuantityInCartIcon()
  },
  removeCartItem: (e) => {
    const selectedItemId = e.target.parentElement.parentElement.dataset.id
    shoppingCartList = shoppingCartList.filter(
      (item) => item.id !== selectedItemId
    )
    app.save()
    app.renderShoppingCart()
    app.updateQuantityInCartIcon()
  },
  renderShoppingCart: () => {
    app.renderCartItem()
    app.updateCartItemNumber()
    app.updateTotalAmount()
  },
  renderCartItem: async () => {
    if (shoppingCartList.length === 0) {
      shoppingCartItemsContainer.innerHTML = `
      <div class="cart-empty-message-title">your cart is empty</div>
      <div class="cart-empty-message-content">
      looks like you have not added anything to your cart. <br>
      go ahead & explore.
      </div>
      `
      return
    }

    //use cartItem's id to retrieve latest product info from masterProductList
    const listWithLastestProductInfo = shoppingCartList.map((cartItem) => ({
      ...cartItem,
      ...masterProductList.find(({ id }) => id == cartItem.id)
    }))

    const html = listWithLastestProductInfo.map((cartItem) => {
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
        <div class="sub-total">$${cartItem.price}</div>
      </div>
    `
    })
    shoppingCartItemsContainer.innerHTML = html.join('')
  },
  updateCartItemNumber: () => {
    if (shoppingCartList.length === 0) {
      shoppingCartBtns[0].innerText = `cart(0)`
      shoppingCartNumberIcon.innerText = 0
    } else {
      const totalCartItem = shoppingCartList
        .map((item) => {
          return item.quantity
        })
        .reduce((sum, quantity) => sum + quantity)
      shoppingCartBtns[0].innerText = `cart(${totalCartItem})`
      shoppingCartNumberIcon.innerText = totalCartItem
    }
  },
  updateTotalAmount: async() => {
    if (shoppingCartList.length === 0) {
      shoppingCartTotalAmount.innerText = '$0.00'
    } else {
      const listWithLastestProductInfo = shoppingCartList.map((cartItem) => ({
        ...cartItem,
        ...masterProductList.find(({ id }) => id == cartItem.id)
      }))

      const cartTotalAmount = listWithLastestProductInfo
        .map((item) => {
          return item.price * item.quantity
        })
        .reduce((sum, amount) => sum + amount)
      shoppingCartTotalAmount.innerText = `$${cartTotalAmount.toFixed(2)}`
    }
  },
  checkout: () => {
    //make a POST request to our server
    //need to fetch with full url, if client and server are not running on the same place
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        // declare that we are sending json information
        'Content-Type': 'application/json'
      },
      //actually sending the product information in json
      body: JSON.stringify({
        items: shoppingCartList
      })
    })
      .then((res) => {
        // if it is good response, successful, return the response (which is a url) in json
        if (res.ok) return res.json()
        // if it is a failure, send the response to promise.reject and make sure it actually fails cause fetch doesn't fail on its own
        return res.json().then((json) => Promise.reject(json))
      })
      .then(({ url }) => {
        //redirect the user to the returned url
        window.location = url
      })
      .catch((e) => {
        console.error(e.error)
      })
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
