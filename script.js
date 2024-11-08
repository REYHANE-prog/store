let currentIndex = 0;
const root = document.querySelector(".root");
let productsRoot;
let showAllProducts = false;

async function renderMenuCategories() {
  const cats = await fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((json) => json);

  const temp = cats
    .map((item) => {
      return `
          <li class="under"><a href="/categories/${item}" onclick="handleBClick(event)"> ${item}
          </a></li>
        `;
    })
    .join("");
  const temp2 = cats
    .map((item) => {
      return `
          <li class="under"><a href="/categories/${item}" onclick="handleBClick(event)"> ${item}
          </a></li>
        `;
    })
    .join("");

  const catsMenu = document.getElementById("ul");
  const cats2menu = document.getElementById("burger");

  catsMenu.innerHTML += temp;
  cats2menu.innerHTML += temp2;
}
renderMenuCategories();

async function getAllProductsByFilter(limit = "") {
  const result = await fetch(
    `https://fakestoreapi.com/products${limit ? `?limit=${limit}` : ""}`
  ).then((res) => res.json());

  return result;
}

function openNav() {
    document.querySelector(".nav").classList.toggle("alaki");
  }
function renderProducts(list) {
  const template = list
    .map((product) => {
      return `
        <div
        onclick="handleProductClick(${product.id})"
            <div class="card" style=" background: url(${product.image}); 
        background-repeat: no-repeat;
        background-size: cover;">
                <div class="overlay">
                    <div class="items"></div>
                    <div class="items head">
                        <p>${product.title}</p>
                        <hr>
                    </div>
                    <div class="items price">
                        <p class="">${product.price}</p>
                    </div>
                    <div class="items cart">
                        <i class="fa fa-shopping-cart"></i>
                        <span>ADD TO CART</span>
                    </div>
                </div>
            </div>
          `;
    })
    .join("");

  productsRoot.innerHTML = template;
}

// function handleProductClick(productId) {
//     history.pushState({}, "", `/products/${productId}`);
//     checkState();
//   }

  async function renderAllProducts() {
    const data = await getAllProductsByFilter();
    renderProducts(data);
  }
  async function renderLimitedProducts() {
    const limitedProducts = await getAllProductsByFilter("4");
    renderProducts(limitedProducts);
  }
  
  async function renderMainPage() {
    const mainTemplate = `
          <section class="Products">
          <h2>Products</h2>
            <div
              class="cards"
              id="products-root"
            ></div>
            <a
              href="/products"
              id="toggleButton"
              onclick="handleAClick(event)"
              class="a-products"
            >
            More items 
            </a>
          </section>
        `;
  
    root.innerHTML = mainTemplate;
    productsRoot = document.getElementById("products-root");
    await renderLimitedProducts();
  }

  function renderSingleCategory(list) {
    const template = list
      .map((product) => {
        return `
        <div
        onclick="handleProductClick(${product.id})"
            <div class="card" style=" background: url(${product.image}); 
        background-repeat: no-repeat;
        background-size: contain;">
                <div class="overlay">
                    <div class="items"></div>
                    <div class="items head">
                        <p>${product.title}</p>
                        <hr>
                    </div>
                    <div class="items price">
                        <p class="">${product.price}</p>
                    </div>
                    <div class="items cart">
                        <i class="fa fa-shopping-cart"></i>
                        <span>ADD TO CART</span>
                    </div>
                </div>
            </div>
            `;
      })
      .join("");
  
    const result = `
            <div class="cards">
              ${template}
            </div>
          `;
  
    root.innerHTML = result;
  }
  renderMainPage();


  function handleBClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    history.pushState({}, "", href);
  
    checkState();
  }
  async function handleAClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
  
    showAllProducts = !showAllProducts;
  
    if (showAllProducts) {
      await renderAllProducts();
      document.getElementById("toggleButton").innerText = "return";
    } else {
      await renderLimitedProducts();
      document.getElementById("toggleButton").innerText = "More items";
    }
  
    history.pushState({}, "", href);
    checkState();
  }
  async function getSingleCategory(cat) {
    const result = await fetch(
      `https://fakestoreapi.com/products/category/${cat}`
    )
      .then((res) => res.json())
      .then((json) => json);
  
    return result;
  }
  

  async function checkState() {
    const pathName = location.pathname;
    switch (true) {
      case pathName === "/products":
        if (showAllProducts) {
          await renderAllProducts();
        } else {
          await renderLimitedProducts();
        }
        break;
      case pathName === "/src/index.html":
        renderMainPage();
        break;
      case pathName.includes("/categories/"):
        let cat = pathName.split("/").pop();
        const catProducts = await getSingleCategory(cat);
        renderSingleCategory(catProducts);
        break;
      default:
        renderMainPage();
        break;
    }
  }
  window.addEventListener("popstate", checkState);

function moveSlide(step) {
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  currentIndex += step;

  if (currentIndex < 0) {
    currentIndex = totalSlides - 1;
  } else if (currentIndex >= totalSlides) {
    currentIndex = 0;
  }

  const slider = document.querySelector(".slider");
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(() => {
  moveSlide(1);
}, 3000);
