const SUPABASE_URL = "https://dkcuuwpgcfgvknvpqkcb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kGtEPUmswwbTI4WJ7R9-Rg_fwxF5YmH";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read the product id from the URL, e.g. product-detail.html?id=2
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  const { data: product } = await supabaseClient
    .from("product")
    .select("*, category(category_name)")
    .eq("product_id", productId)
    .single();

  if (!product) {
    document.getElementById("detail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("detail").innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.description || ""}</p>
    <p>AED ${Number(product.price).toLocaleString()}</p>
    <p>Category: ${product.category ? product.category.category_name : "—"}</p>
    <p>Stock: ${product.stock}</p>`;
}

loadProduct();