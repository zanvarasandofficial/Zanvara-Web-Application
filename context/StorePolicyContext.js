"use client";



import {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useState,

} from "react";

import { fetchStoreSettings } from "../lib/api/store-settings";

import { DEFAULT_FREE_DELIVERY_MIN_TABLES } from "../lib/content/store-policy";

import { buildStorePolicyCopy } from "../lib/content/store-policy-copy";

import { DEFAULT_PKR_TO_USD_RATE } from "../lib/money/constants";

import { syncMoneyFormatterState } from "../lib/money/format";



const StorePolicyContext = createContext(null);



export function StorePolicyProvider({ children }) {

  const [freeDeliveryMinTableQuantity, setFreeDeliveryMinTableQuantity] = useState(

    DEFAULT_FREE_DELIVERY_MIN_TABLES,

  );

  const [pkrToUsdRate, setPkrToUsdRate] = useState(DEFAULT_PKR_TO_USD_RATE);

  const [isReady, setIsReady] = useState(false);



  useEffect(() => {

    let active = true;



    async function load() {

      const settings = await fetchStoreSettings();

      if (active) {

        setFreeDeliveryMinTableQuantity(settings.freeDeliveryMinTableQuantity);

        setPkrToUsdRate(settings.pkrToUsdRate);

        syncMoneyFormatterState({ pkrToUsdRate: settings.pkrToUsdRate });

        setIsReady(true);

      }

    }



    load();



    function handleSettingsUpdated() {

      load();

    }



    window.addEventListener("zanvara-store-settings-updated", handleSettingsUpdated);



    return () => {

      active = false;

      window.removeEventListener("zanvara-store-settings-updated", handleSettingsUpdated);

    };

  }, []);



  const value = useMemo(

    () => ({

      isReady,

      freeDeliveryMinTableQuantity,

      pkrToUsdRate,

      ...buildStorePolicyCopy(freeDeliveryMinTableQuantity),

    }),

    [freeDeliveryMinTableQuantity, pkrToUsdRate, isReady],

  );



  return (

    <StorePolicyContext.Provider value={value}>{children}</StorePolicyContext.Provider>

  );

}



export function useStorePolicy() {

  const context = useContext(StorePolicyContext);

  if (!context) {

    throw new Error("useStorePolicy must be used within StorePolicyProvider");

  }

  return context;

}


