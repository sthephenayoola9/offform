"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Plus,
  Scissors,
  CheckCircle2,
  Clock,
  Truck,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";

interface SellerWorkspaceClientProps {
  initialProducts: any[];
  initialOrders: any[];
  commissionRequests: any[];
  sellerId: string;
}

export function SellerWorkspaceClient({
  initialProducts,
  initialOrders,
  commissionRequests,
  sellerId,
}: SellerWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "commissions">("listings");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // New Listing Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    category: "Outerwear",
    productType: "READY_MADE",
    price: 180,
    currency: "USD",
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
    materials: "100% Organic Cotton Twill, Stainless Hardware",
    measurements: "S, M, L available",
    leadTimeDays: 4,
    hasCustomisation: false,
    customOptionName: "Hardware Finish",
    customOptionValues: "Oxidized Silver (+0), Antiqued Copper (+20), Matte Black (+10)",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload: any = {
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        productType: newProduct.productType,
        price: Number(newProduct.price),
        currency: newProduct.currency,
        stock: Number(newProduct.stock),
        images: [newProduct.imageUrl],
        materials: newProduct.materials,
        measurements: newProduct.measurements,
        leadTimeDays: Number(newProduct.leadTimeDays),
      };

      if (newProduct.productType === "CUSTOMISABLE" && newProduct.hasCustomisation) {
        // Parse options e.g. "Oxidized Silver (+0), Antiqued Copper (+20)"
        const valArray = newProduct.customOptionValues.split(",").map((item) => {
          const match = item.match(/(.+?)\s*\(\+(\d+)\)/);
          if (match) {
            return { label: match[1].trim(), extra: Number(match[2]) };
          }
          return { label: item.trim(), extra: 0 };
        });

        payload.customizationOptions = [
          {
            name: newProduct.customOptionName,
            type: "SELECT",
            values: JSON.stringify(valArray),
            extraPrice: 0,
          },
        ];
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setProducts([data.product, ...products]);
      setModalOpen(false);
      // Reset
      setNewProduct({
        ...newProduct,
        title: "",
        description: "",
      });
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    trackingNumber?: string
  ) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingNumber }),
      });

      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#E7E1DB] space-x-8">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "listings"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Listings ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders & Fulfilment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("commissions")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "commissions"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Bespoke Commissions ({commissionRequests.length})</span>
        </button>
      </div>

      {/* 1. LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Atelier Garment Catalog
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Garment Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              let images = [];
              try {
                images = JSON.parse(product.images);
              } catch (e) {
                images = [product.images];
              }

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E7E1DB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#252321] transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] bg-[#F8F5F0] overflow-hidden">
                      <img
                        src={images[0] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                        {product.productType}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-[#77716D]">
                          {product.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#252321]">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-semibold text-[#252321] line-clamp-1">
                        {product.title}
                      </h3>

                      <p className="text-xs text-[#77716D] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-[#77716D] border-t border-[#F4F1EC]">
                        <span>Stock: {product.stock} units</span>
                        <span>Lead: {product.leadTimeDays} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8F5F0]/60 border-t border-[#E7E1DB] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#246B24] font-semibold">
                      ● {product.status}
                    </span>
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="text-xs font-semibold text-[#A92735] hover:underline flex items-center gap-1"
                    >
                      View Live Page <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Production Queue & Customer Orders
            </h2>
            <span className="text-xs text-[#77716D]">
              Honest status updates are tracked in database audit history
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3">
              <Package className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-xl text-[#252321]">No customer orders yet</p>
              <p className="text-xs text-[#77716D]">
                Orders placed via the Marketplace or custom commission flow will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4F1EC] pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#77716D] uppercase">
                        Order #{order.id.slice(-8)}
                      </span>
                      <h3 className="font-editorial text-xl font-semibold text-[#252321]">
                        Buyer: {order.buyer.displayName} (@{order.buyer.username})
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-editorial text-xl font-bold text-[#252321]">
                        {formatPrice(order.totalAmount, order.currency)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-[#FBECEE] text-[#791D29]">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs p-3 bg-[#F8F5F0] rounded-xl border border-[#E7E1DB]"
                      >
                        <div>
                          <p className="font-semibold text-[#252321]">
                            {item.product.title} (x{item.quantity})
                          </p>
                          {item.customisationSummary && (
                            <p className="text-[11px] text-[#A92735] mt-0.5 font-medium">
                              Config: {item.customisationSummary}
                            </p>
                          )}
                        </div>
                        <span className="font-mono font-medium text-[#252321]">
                          {formatPrice(item.unitPrice, order.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Status Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-[#77716D]">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {order.status !== "IN_PRODUCTION" && order.status !== "SHIPPED" && order.status !== "DELIVERED" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "IN_PRODUCTION")}
                          disabled={statusUpdatingId === order.id}
                          className="px-3 py-1.5 bg-[#252321] text-white rounded-full text-xs font-semibold hover:bg-[#A92735] transition-colors"
                        >
                          Mark In Production
                        </button>
                      )}

                      {order.status === "IN_PRODUCTION" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "READY_TO_SHIP")}
                          disabled={statusUpdatingId === order.id}
                          className="px-3 py-1.5 bg-[#252321] text-white rounded-full text-xs font-semibold hover:bg-[#A92735] transition-colors"
                        >
                          Mark Ready to Ship
                        </button>
                      )}

                      {order.status === "READY_TO_SHIP" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "SHIPPED", "TRK-JP2026-99418")}
                          disabled={statusUpdatingId === order.id}
                          className="px-3 py-1.5 bg-[#A92735] text-white rounded-full text-xs font-semibold hover:bg-[#791D29] transition-colors"
                        >
                          Dispatch & Provide Tracking
                        </button>
                      )}

                      {order.status === "SHIPPED" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                          disabled={statusUpdatingId === order.id}
                          className="px-3 py-1.5 bg-[#246B24] text-white rounded-full text-xs font-semibold hover:bg-[#1C541C] transition-colors"
                        >
                          Confirm Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. COMMISSIONS TAB */}
      {activeTab === "commissions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Custom Commission Requests
            </h2>
            <span className="text-xs text-[#77716D]">
              Direct bespoke garments tailored to client requirements
            </span>
          </div>

          {commissionRequests.length === 0 ? (
            <div className="p-12 bg-white border border-[#E7E1DB] rounded-3xl text-center space-y-3">
              <Scissors className="w-8 h-8 text-[#77716D] mx-auto" />
              <p className="font-editorial text-xl text-[#252321]">No commission requests yet</p>
              <p className="text-xs text-[#77716D]">
                When buyers request bespoke custom work from your designer profile, they appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {commissionRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-lg font-semibold text-[#252321]">
                      Client: {req.buyer.displayName} (@{req.buyer.username})
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-[#F8F5F0] px-2 py-0.5 rounded border border-[#E7E1DB]">
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#77716D] leading-relaxed">
                    Brief: {req.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#77716D] pt-2 border-t border-[#F4F1EC]">
                    <span>Budget: {req.budget ? `$${req.budget}` : "Open quote"}</span>
                    <span>Received: {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E7E1DB] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-4">
              <h3 className="font-editorial text-2xl text-[#252321]">
                Publish New Garment Listing
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F8F5F0] text-[#77716D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#FBECEE] text-[#791D29] rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Asymmetrical Raw-Edge Kimono Coat"
                  className="w-full px-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops & Knits</option>
                    <option value="Bottoms">Bottoms & Trousers</option>
                    <option value="Footwear">Footwear & Boots</option>
                    <option value="Accessories">Accessories & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Product Type
                  </label>
                  <select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  >
                    <option value="READY_MADE">Ready-Made (In Stock)</option>
                    <option value="MADE_TO_ORDER">Made-to-Order (Sustainable)</option>
                    <option value="CUSTOMISABLE">Customisable Options</option>
                    <option value="COMMISSION">Commission Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the silhouette, pattern cuts, drape, and inspiration..."
                  className="w-full px-3 py-2.5 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProduct.leadTimeDays}
                    onChange={(e) => setNewProduct({ ...newProduct, leadTimeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#252321] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#E7E1DB] rounded-xl text-xs"
                />
              </div>

              {/* Customisation Options Builder */}
              {newProduct.productType === "CUSTOMISABLE" && (
                <div className="p-4 bg-[#F8F5F0] border border-[#E7E1DB] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#252321] uppercase text-[10px]">
                      Designer-Defined Customisation Options
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-[#77716D]">
                      <input
                        type="checkbox"
                        checked={newProduct.hasCustomisation}
                        onChange={(e) => setNewProduct({ ...newProduct, hasCustomisation: e.target.checked })}
                      />
                      Enable Options
                    </label>
                  </div>

                  {newProduct.hasCustomisation && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-[#77716D]">Option Group Name</label>
                        <input
                          type="text"
                          value={newProduct.customOptionName}
                          onChange={(e) => setNewProduct({ ...newProduct, customOptionName: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-[#E7E1DB] rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#77716D]">Option Values (e.g. Label (+extraPrice))</label>
                        <input
                          type="text"
                          value={newProduct.customOptionValues}
                          onChange={(e) => setNewProduct({ ...newProduct, customOptionValues: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-[#E7E1DB] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-[#F4F1EC]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs text-[#77716D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#252321] text-white hover:bg-[#A92735] transition-colors rounded-full text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Garment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

