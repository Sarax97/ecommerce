// --- Supabase client ---
const SUPABASE_URL = "https://dkcuuwpgcfgvknvpqkcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kGtEPUmswwbTI4WJ7R9-Rg_fwxF5YmH";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let products = [];

function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }
  list.forEach(prod => {
    const stockLabel = prod.stock === 0 ? "Out of Stock"
      : prod.stock <= 5 ? "Low Stock" : "In Stock";
    container.innerHTML += `
      <div class="product">
        <h3>${prod.name}</h3>
        <p>AED ${Number(prod.price).toLocaleString()}</p>
        <p class="stock">${stockLabel}</p>
        <a href="product-detail.html?id=${prod.product_id}">View details</a>
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
}

// --- Fetch products from Supabase ---
async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .order("name");

  if (error) {
    document.getElementById("product-list").innerHTML =
      `<p>Could not load products: ${error.message}</p>`;
    return;
  }

  products = data.map(p => ({
    ...p,
    category: p.category ? p.category.category_name : ""
  }));

  renderProducts(products);
}

loadProducts();

// --- Search + filter + sort ---
let currentSearch = "";
let currentCategory = "All";
let currentSort = "";

function applyAll() {
  let result = products.filter(p =>
    p.name.toLowerCase().includes(currentSearch) &&
    (currentCategory === "All" ||
      p.category.toLowerCase().startsWith(currentCategory.toLowerCase().replace(/s$/, "")))
  );

  if (currentSort === "low-high") result.sort((a, b) => a.price - b.price);
  if (currentSort === "high-low") result.sort((a, b) => b.price - a.price);

  renderProducts(result);
}

const searchBox = document.getElementById("search-box");
if (searchBox) {
  searchBox.addEventListener("input", e => {
    currentSearch = e.target.value.toLowerCase();
    applyAll();
  });
}

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyAll();
  });
});

const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
  sortSelect.addEventListener("change", e => {
    currentSort = e.target.value;
    applyAll();
  });
}