//hooks/Auth/useIAP.ts
import { useState, useEffect, useCallback } from 'react';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Alert, Platform } from 'react-native';

const productIds = [
    'com.talkmate.premium.yearly',
    'com.talkmate.premium.quarterly',
    'com.talkmate.premium.monthly',
];

export const useIAP = () => {
  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupIAP = async () => {
      try {
        console.log('Starting IAP setup...');
        console.log('Platform:', Platform.OS);
        console.log('Product IDs:', productIds);

        await InAppPurchases.connectAsync();
        console.log('Connected to IAP successfully');
        
        InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
          console.log('Purchase listener triggered', responseCode);
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results?.forEach(async (purchase) => {
              if (!purchase.acknowledged) {
                console.log('Purchase successful:', purchase);
                await InAppPurchases.finishTransactionAsync(purchase, true);
                setPurchaseComplete(true);
              }
            });
          } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log('User canceled the transaction');
          } else {
            console.error('Purchase error:', responseCode);
            setError(`Purchase failed with code: ${responseCode}`);
          }
        });

        console.log('Fetching products...');
        const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
        console.log('Get products response code:', responseCode);
        console.log('Get products results:', results);

        if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
          console.log('Products fetched successfully:', results);
          setProducts(results);
        } else {
          console.error(`Failed to fetch products. Response code: ${responseCode}`);
          setError(`Failed to fetch products. Response code: ${responseCode}`);
        }
      } catch (err) {
        console.error('Error setting up IAP:', err);
        setError(`Failed to set up in-app purchases: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    setupIAP();

    return () => {
      console.log('Disconnecting from IAP...');
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const purchaseItem = useCallback(async (productId: string) => {
    try {
      setPurchaseComplete(false);
      console.log(`Attempting to purchase item: ${productId}`);
      await InAppPurchases.purchaseItemAsync(productId);
      
      let attempts = 0;
      while (!purchaseComplete && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (purchaseComplete) {
        console.log('Purchase completed successfully');
        return true;
      } else {
        console.log('Purchase did not complete in time');
        return false;
      }
    } catch (err) {
      console.error('Error purchasing item:', err);
      setError(`Failed to complete purchase: ${err}`);
      return false;
    }
  }, [purchaseComplete]);

  return { products, isLoading, purchaseItem, error };
};