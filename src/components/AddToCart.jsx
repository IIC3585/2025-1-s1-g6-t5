import { useState, useEffect } from 'react';

export default function AddToCart({ product, className = '' }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('musicCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    };

    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let newCart;

    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      // Agregar nuevo item
      newCart = [...cart, cartItem];
    }

    setCart(newCart);
    localStorage.setItem('musicCart', JSON.stringify(newCart));
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: newCart } 
    }));
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (!product.inStock) {
    return (
      <div className={`add-to-cart out-of-stock ${className}`}>
        <button disabled className="btn-disabled">
          Agotado
        </button>
      </div>
    );
  }

  return (
    <div className={`add-to-cart ${className}`}>
      <div className="quantity-selector">
        <button 
          onClick={decrementQuantity}
          className="quantity-btn"
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          onClick={incrementQuantity}
          className="quantity-btn"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={addToCart}
        className={`add-btn ${isAdded ? 'added' : ''}`}
        disabled={isAdded}
      >
        {isAdded ? '¡Agregado!' : 'Agregar al Carrito'}
      </button>

      <style jsx>{`
        .add-to-cart {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-btn {
          background: #f9fafb;
          border: none;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
          color: #374151;
          transition: background-color 0.2s;
          min-width: 40px;
        }

        .quantity-btn:hover {
          background: #e5e7eb;
        }

        .quantity-btn:active {
          background: #d1d5db;
        }

        .quantity-display {
          padding: 0.5rem 1rem;
          background: white;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          font-weight: 600;
          min-width: 50px;
          text-align: center;
        }

        .add-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 200px;
          font-size: 0.95rem;
        }

        .add-btn:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .add-btn:active {
          transform: translateY(0);
        }

        .add-btn.added {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          animation: pulse 0.6s ease-out;
        }

        .btn-disabled {
          background: #9ca3af;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: not-allowed;
          font-weight: 600;
          opacity: 0.6;
        }

        .out-of-stock {
          justify-content: center;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @media (max-width: 640px) {
          .add-to-cart {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .quantity-selector {
            justify-content: center;
            max-width: 150px;
            margin: 0 auto;
          }

          .add-btn {
            max-width: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}