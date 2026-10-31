"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface OptionItem {
  id: string;
  name: string;
  type: string;
  values: string;
  extraPrice: number;
}

interface ProductConfiguratorProps {
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    productType: string;
    stock: number;
    leadTimeDays: number;
    materials: string | null;
    measurements: string | null;
    productionOrigin: string | null;
    customizationOptions: OptionItem[];
    seller: {
      id: string;
      displayName: string;
      username: string;
      isVerifiedDesigner: boolean;
    };
  };
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  // Parse options
  const parsedOptions = product.customizationOptions.map((opt) => ({
    ...opt,
    valueList: JSON.parse(opt.values || "[]") as { label: string; extra: number }[],
  }));

  // Selected values map: { "Distressing Level": { label: "Heavy...", extra: 25 } }
  const [selections, setSelections] = useState<Record<string, { label: string; extra: number }>>(() => {
    const init: Record<string, { label: string; extra: number }> = {};
    parsedOptions.forEach((opt) => {
      if (opt.valueList.length > 0) {
        init[opt.name] = opt.valueList[0];
      }
    });
    return init;
  });

  // Calculate total price dynamically
  const extraTotal = Object.values(selections).reduce((acc, curr) => acc + (curr.extra || 0), 0);
  const finalPrice = product.price + extraTotal;

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState({
    fullName: "Elena Vance",
    street: "742 Evergreen Terrace",
    city: "Brooklyn, NY",
    postalCode: "11201",
    country: "United States",
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectOption = (optName: string, val: { label: string; extra: number }) => {
    setSelections((prev) => ({
      ...prev,
      [optName]: val,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customisationSelections: selections,
          shippingAddress: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Order failed.");
      } else {
        setConfirmedOrder(data.order);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Price Display */}
      <div className="border-b border-[#E7E1DB] pb-4">
        <div className="flex items-baseline gap-3">
          <span className="font-editorial text-4xl font-bold text-[#252321]">
            {formatPrice(finalPrice, product.currency)}
          </span>
          {extraTotal > 0 && (
            <span className="text-xs text-[#A92735] font-semibold">
              (+{formatPrice(extraTotal, product.currency)} customisation)
            </span>
          )}
        </div>
        <p className="text-xs text-[#77716D] mt-1">
          Taxes and artisanal packing included. Transparent production.
        </p>
      </div>

      {/* Designer-configured Customisation Options */}
      {parsedOptions.length > 0 && (
        <div className="space-y-5 bg-[#FAF7F2] p-5 rounded-xl border border-[#E7E1DB]">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#791D29]">
            <Sparkles className="w-3.5 h-3.5" /> Designer-Configured Options
          </div>

          {parsedOptions.map((opt) => (
            <div key={opt.id} className="space-y-2">
              <label className="block text-xs font-semibold text-[#252321]">
                {opt.name}:{" "}
                <span className="font-normal text-[#77716D]">
                  {selections[opt.name]?.label || "Select..."}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {opt.valueList.map((val) => {
                  const isSelected = selections[opt.name]?.label === val.label;
                  return (
                    <button
                      key={val.label}
                      type="button"
                      onClick={() => handleSelectOption(opt.name, val)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-white border-[#A92735] text-[#252321] ring-1 ring-[#A92735] shadow-sm font-semibold"
                          : "bg-white/60 border-[#E7E1DB] text-[#77716D] hover:bg-white"
                      }`}
                    >
                      <span className="truncate">{val.label}</span>
                      {val.extra > 0 && (
                        <span className="text-[11px] font-bold text-[#A92735] ml-2">
                          +{formatPrice(val.extra, product.currency)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="space-y-2">
        <button
          onClick={() => setCheckoutOpen(true)}
          className="w-full py-4 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Lock className="w-4 h-4" /> Secure Order & Checkout
        </button>
        <p className="text-[11px] text-[#A49E99] text-center">
          Direct payment to independent creator · Protected by OFFFORM terms
        </p>
      </div>

      {/* Trust & Policy Assurance Signals */}
      <div className="space-y-3 pt-4 border-t border-[#E7E1DB] text-xs text-[#77716D]">
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-[#A92735] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#252321]">
              Production & Dispatch:
            </span>{" "}
            Estimated {product.leadTimeDays} days lead time from {product.productionOrigin || "studio"}.
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#A92735] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#252321]">
              Verified Designer Protection:
            </span>{" "}
            Original creator authenticated. Hand-crafted in compliant batches.
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 text-[#A92735] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#252321]">Cancellation Policy:</span>{" "}
            {product.productType === "READY_MADE"
              ? "14-day return window upon delivery."
              : "Made-to-order production locks once cutting begins."}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#252321]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-[#E7E1DB] p-6 shadow-editorial space-y-5 animate-in zoom-in-95">
            {confirmedOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FBECEE] text-[#791D29] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-editorial text-3xl font-bold text-[#252321]">
                    Order Confirmed
                  </h3>
                  <p className="text-xs text-[#77716D] mt-1">
                    Order Ref: <span className="font-mono font-bold text-[#252321]">{confirmedOrder.id}</span>
                  </p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E7E1DB] text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#77716D]">Garment:</span>
                    <span className="font-semibold text-[#252321]">{product.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77716D]">Total Paid:</span>
                    <span className="font-bold text-[#A92735]">
                      {formatPrice(confirmedOrder.totalAmount, confirmedOrder.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77716D]">Status:</span>
                    <span className="font-semibold text-[#1F4236] bg-[#F0F4F2] px-2 py-0.5 rounded">
                      {confirmedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#77716D]">Fulfillment:</span>
                    <span className="text-[#252321]">Dispatched to {product.seller.displayName}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setConfirmedOrder(null);
                  }}
                  className="px-6 py-2.5 bg-[#252321] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#A92735] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#F4F1EC] pb-3">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                      Checkout & Order Dispatch
                    </h3>
                    <p className="text-[11px] text-[#77716D]">
                      Independent Studio Fulfillment
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="text-[#77716D] hover:text-[#252321]"
                  >
                    ✕
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-[#FBECEE] text-[#791D29] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                  </div>
                )}

                {/* Order Summary Snapshot */}
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E7E1DB] space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#252321]">
                    <span>{product.title}</span>
                    <span>{formatPrice(finalPrice, product.currency)}</span>
                  </div>
                  <div className="text-[11px] text-[#77716D]">
                    Studio: {product.seller.displayName} · Lead time: ~{product.leadTimeDays} days
                  </div>
                </div>

                {/* Shipping Form */}
                <div className="space-y-3">
                  <span className="font-bold text-[#252321] block">Delivery Information</span>

                  <div>
                    <label className="block text-[#77716D] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#77716D] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#77716D] mb-1">City & State</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#77716D] mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#77716D] mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full bg-[#F8F5F0] border border-[#E7E1DB] rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4F1EC] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="px-4 py-2 border border-[#E7E1DB] rounded-full text-xs font-semibold text-[#77716D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="px-6 py-2.5 bg-[#A92735] hover:bg-[#791D29] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    {submittingOrder ? "Confirming..." : `Authorize ${formatPrice(finalPrice, product.currency)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
