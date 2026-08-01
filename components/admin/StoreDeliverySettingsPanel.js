"use client";



import { useEffect, useState } from "react";

import {

  adminInputClassName,

  adminLabelClassName,

  adminPrimaryButtonClassName,

  adminCardClassName,

} from "../../lib/ui/adminStyles";

import { adminFetch } from "../../lib/api/admin-client";

import { buildBuyTwoFreeDeliveryMessage } from "../../lib/content/store-policy-copy";

import { DEFAULT_PKR_TO_USD_RATE } from "../../lib/money/constants";

import { formatMoney } from "../../lib/money/format";



export default function StoreDeliverySettingsPanel() {

  const [minTables, setMinTables] = useState("2");

  const [pkrToUsdRate, setPkrToUsdRate] = useState(String(DEFAULT_PKR_TO_USD_RATE));

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  useEffect(() => {

    let active = true;



    async function load() {

      setLoading(true);

      setError("");



      try {

        const data = await adminFetch("/admin/store-settings");

        if (active) {

          setMinTables(String(data.freeDeliveryMinTableQuantity ?? 2));

          setPkrToUsdRate(String(data.pkrToUsdRate ?? DEFAULT_PKR_TO_USD_RATE));

        }

      } catch (loadError) {

        if (active) {

          setError(loadError.message ?? "Could not load store settings.");

        }

      } finally {

        if (active) {

          setLoading(false);

        }

      }

    }



    load();



    return () => {

      active = false;

    };

  }, []);



  const previewMin = Math.max(1, Number(minTables) || 1);

  const previewRate = Math.max(1, Number(pkrToUsdRate) || DEFAULT_PKR_TO_USD_RATE);

  const samplePkr = 49999;



  async function handleSave(event) {

    event.preventDefault();

    setError("");

    setSuccess("");



    const value = Number(minTables);

    const rate = Number(pkrToUsdRate);



    if (!Number.isInteger(value) || value < 1 || value > 50) {

      setError("Enter a whole number between 1 and 50 for free delivery tables.");

      return;

    }



    if (!Number.isFinite(rate) || rate < 1 || rate > 2000) {

      setError("Enter a valid PKR per USD rate between 1 and 2000.");

      return;

    }



    setSaving(true);



    try {

      const data = await adminFetch("/admin/store-settings", {

        method: "PUT",

        body: JSON.stringify({

          freeDeliveryMinTableQuantity: value,

          pkrToUsdRate: rate,

        }),

      });

      setMinTables(String(data.freeDeliveryMinTableQuantity));

      setPkrToUsdRate(String(data.pkrToUsdRate ?? rate));

      setSuccess("Store settings saved. Currency display updates on the storefront.");

      window.dispatchEvent(new CustomEvent("zanvara-store-settings-updated"));

    } catch (saveError) {

      setError(saveError.message ?? "Could not save settings.");

    } finally {

      setSaving(false);

    }

  }



  if (loading) {

    return (

      <p className="text-sm text-slate-500">Loading store delivery settings…</p>

    );

  }



  return (

    <form onSubmit={handleSave} className="space-y-5">

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-600">

        Per-product delivery (free or charged) is still set on each product. These settings

        control cart free-delivery rules and how international visitors see USD prices.

      </div>



      <label className="flex max-w-xs flex-col gap-2">

        <span className={adminLabelClassName}>Minimum tables for free delivery</span>

        <input

          type="number"

          min={1}

          max={50}

          step={1}

          required

          value={minTables}

          onChange={(event) => setMinTables(event.target.value)}

          className={adminInputClassName}

        />

        <span className="text-xs leading-5 text-slate-500">

          Cart total quantity (any products) must reach this number for delivery to be Rs 0.

        </span>

      </label>



      <label className="flex max-w-xs flex-col gap-2">

        <span className={adminLabelClassName}>PKR per 1 USD (display rate)</span>

        <input

          type="number"

          min={1}

          max={2000}

          step={0.01}

          required

          value={pkrToUsdRate}

          onChange={(event) => setPkrToUsdRate(event.target.value)}

          className={adminInputClassName}

        />

        <span className="text-xs leading-5 text-slate-500">

          Used when visitors outside Pakistan see approximate dollar prices. Orders are still

          stored in PKR.

        </span>

      </label>



      <div className={`${adminCardClassName} border-dashed bg-white p-4`}>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">

          Storefront preview

        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">

          {buildBuyTwoFreeDeliveryMessage(previewMin)}

        </p>

        <p className="mt-3 text-sm text-slate-600">

          Sample table {formatMoney(samplePkr, { currency: "PKR" })} →{" "}

          {formatMoney(samplePkr, { currency: "USD", rate: previewRate })}

        </p>

      </div>



      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}



      <button

        type="submit"

        disabled={saving}

        className={`${adminPrimaryButtonClassName} disabled:opacity-60`}

      >

        {saving ? "Saving…" : "Save store settings"}

      </button>

    </form>

  );

}


