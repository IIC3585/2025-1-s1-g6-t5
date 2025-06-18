<script>
  import { onMount } from 'svelte';
  
  let isVisible = false;
  let cart = [];
  let totalItems = 0;
  let totalValue = 0;
  let orders = [];
  let activeTab = 'cart';

  onMount(() => {
    loadCartData();
    loadOrders();
    
    // Escuchar actualizaciones del carrito
    const handleCartUpdate = (event) => {
      cart = event.detail.cart;
      updateTotals();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  });

  function loadCartData() {
    const savedCart = localStorage.getItem('musicCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateTotals();
    }
  }

  function loadOrders() {
    const savedOrders = localStorage.getItem('musicOrders');
    if (savedOrders) {
      orders = JSON.parse(savedOrders);
    }
  }

  function updateTotals() {
    totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function toggleVisibility() {
    isVisible = !isVisible;
  }

  function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      cart = [];
      localStorage.removeItem('musicCart');
      updateTotals();
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart: [] } 
      }));
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('musicCart', JSON.stringify(cart));
    updateTotals();
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart } 
    }));
  }

  function processOrder() {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const order = {
      id: Date.now(),
      items: [...cart],
      total: totalValue,
      date: new Date().toLocaleDateString(),
      status: 'Procesando'
    };

    orders = [order, ...orders];
    localStorage.setItem('musicOrders', JSON.stringify(orders));
    
    // Limpiar carrito después de procesar
    clearCart();
    alert('¡Orden procesada exitosamente!');
    activeTab = 'orders';
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
</script>

<!-- Botón flotante para abrir el panel -->
<button 
  class="admin-toggle" 
  on:click={toggleVisibility}
  aria-label="Abrir panel de administración"
>
  🛠️
</button>

<!-- Panel de administración -->
{#if isVisible}
  <div class="admin-panel">
    <div class="panel-header">
      <h3>Panel de Administración</h3>
      <button class="close-btn" on:click={toggleVisibility}>×</button>
    </div>
    
    <div class="panel-tabs">
      <button 
        class="tab-btn {activeTab === 'cart' ? 'active' : ''}"
        on:click={() => activeTab = 'cart'}
      >
        Carrito ({totalItems})
      </button>
      <button 
        class="tab-btn {activeTab === 'orders' ? 'active' : ''}"
        on:click={() => activeTab = 'orders'}
      >
        Órdenes ({orders.length})
      </button>
    </div>

    <div class="panel-content">
      {#if activeTab === 'cart'}
        <div class="cart-section">
          <div class="cart-summary">
            <p><strong>Total items:</strong> {totalItems}</p>
            <p><strong>Valor total:</strong> {formatPrice(totalValue)}</p>
          </div>
          
          {#if cart.length > 0}
            <div class="cart-items">
              {#each cart as item}
                <div class="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div class="item-info">
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio: {formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <button 
                    class="remove-btn"
                    on:click={() => removeFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            </div>
            
            <div class="cart-actions">
              <button class="process-btn" on:click={processOrder}>
                Procesar Orden
              </button>
              <button class="clear-btn" on:click={clearCart}>
                Vaciar Carrito
              </button>
            </div>
          {:else}
            <p class="empty-message">El carrito está vacío</p>
          {/if}
        </div>
      {:else if activeTab === 'orders'}
        <div class="orders-section">
          {#if orders.length > 0}
            {#each orders as order}
              <div class="order-item">
                <div class="order-header">
                  <h4>Orden #{order.id}</h4>
                  <span class="order-status">{order.status}</span>
                </div>
                <p>Fecha: {order.date}</p>
                <p>Total: {formatPrice(order.total)}</p>
                <p>Items: {order.items.length}</p>
              </div>
            {/each}
          {:else}
            <p class="empty-message">No hay órdenes registradas</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .admin-toggle {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #1f2937;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .admin-toggle:hover {
    background: #374151;
    transform: scale(1.1);
  }

  .admin-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 400px;
    max-width: 90vw;
    max-height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }

  .panel-header {
    background: #1f2937;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .panel-tabs {
    display: flex;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .tab-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: white;
    color: #1f2937;
    border-bottom: 2px solid #3b82f6;
  }

  .tab-btn:hover {
    background: #e5e7eb;
  }

  .panel-content {
    padding: 1rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .cart-summary {
    background: #f3f4f6;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .cart-summary p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  .cart-items {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .cart-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }

  .item-info {
    flex: 1;
  }

  .item-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: #1f2937;
  }

  .item-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
  }

  .remove-btn {
    background: #ef4444;
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
  }

  .remove-btn:hover {
    background: #dc2626;
  }

  .cart-actions {
    display: flex;
    gap: 0.5rem;
  }

  .process-btn {
    flex: 1;
    background: #10b981;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .process-btn:hover {
    background: #059669;
  }

  .clear-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .clear-btn:hover {
    background: #dc2626;
  }

  .order-item {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .order-header h4 {
    margin: 0;
    color: #1f2937;
    font-size: 0.95rem;
  }

  .order-status {
    background: #3b82f6;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .order-item p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .empty-message {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    padding: 2rem 0;
  }

  @media (max-width: 640px) {
    .admin-panel {
      width: 95vw;
      top: 10px;
      left: 2.5vw;
      max-height: 85vh;
    }

    .admin-toggle {
      bottom: 15px;
      left: 15px;
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
    }
  }
</style>