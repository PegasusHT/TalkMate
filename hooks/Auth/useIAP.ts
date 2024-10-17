// hooks/Auth/useIAP.ts
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const productIds = Platform.select({
  ios: [
    'com.jimmydev.TalkMate.premium.yearly',
    'com.jimmydev.TalkMate.premium.quarterly',
    'com.jimmydev.TalkMate.premium.monthly',
  ],
  android: [
    // Add Android product IDs here if applicable
  ],
}) || [];

export const useIAP = () => {
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    const initIAP = async () => {
      try {
        console.log('Initializing IAP connection...');
        await RNIap.initConnection();
        console.log('IAP connection initialized');

        // Fetch available products
        console.log('Fetching products...');
        const availableProducts = await RNIap.getProducts({ skus: productIds });
        console.log('Products fetched:', availableProducts);
        setProducts(availableProducts);
      } catch (err) {
        console.error('IAP initialization error:', err);
        setPurchaseError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initIAP();

    return () => {
      console.log('Ending IAP connection...');
      RNIap.endConnection();
    };
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      console.log('Purchase updated:', purchase);
      const receipt = purchase.transactionReceipt;

      if (receipt) {
        try {
          // Validate the receipt with your backend server here
          // Then provide the user with the purchased content

          await RNIap.finishTransaction({ purchase, isConsumable: false });
        } catch (err) {
          console.warn('Error in purchaseUpdateSubscription:', err);
        }
      }
    });

    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
      console.error('Purchase error:', error);
      setPurchaseError(error.message);
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const purchaseItem = useCallback(async (productId: string) => {
    try {
      console.log(`Attempting to purchase item: ${productId}`);
      await RNIap.requestPurchase({ sku: productId });
      return true;
    } catch (err) {
      console.error('Error purchasing item:', err);
      setPurchaseError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  }, []);

  return { products, isLoading, purchaseItem, error: purchaseError };
};
