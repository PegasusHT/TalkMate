import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const productIds = Platform.select({
  ios: [
    'yearly_premium',
    'quarterly_premium',
    'monthly_premium',
  ],
  android: [
    // Add Android product IDs here if applicable
  ],
}) || [];

export const useIAP = () => {
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        const availableProducts = await RNIap.getProducts({ skus: productIds });
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
      RNIap.endConnection();
    };
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
        } catch (err) {
          console.warn('Error in purchaseUpdateSubscription:', err);
        }
      }
      setIsPurchasing(false);
    });

    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
      console.log('Purchase error:', error);
      setPurchaseError(error.message);
      setIsPurchasing(false);
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const purchaseItem = useCallback(async (productId: string) => {
    try {
      setIsPurchasing(true);
      setPurchaseError(null);
      await RNIap.requestPurchase({ sku: productId });
      return true;
    } catch (err) {
      console.log('Error purchasing item:', err);
      setPurchaseError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsPurchasing(false);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setPurchaseError(null);
  }, []);

  return { products, isLoading, purchaseItem, error: purchaseError, isPurchasing, clearError };
};