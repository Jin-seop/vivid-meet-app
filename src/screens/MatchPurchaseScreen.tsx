import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Zap } from 'lucide-react-native';
import * as IAP from 'react-native-iap';

import AMText from '../components/common/AMText';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import { userApi } from '../api/user';
import { useAuth } from '../context/AuthContext';

const itemSkus = Platform.select({
  ios: ['match_1', 'match_10', 'match_50', 'match_100'],
  android: ['match_1', 'match_10', 'match_50', 'match_100'],
}) || [];

const MatchPurchaseScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [products, setProducts] = useState<IAP.Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initIAP = async () => {
      try {
        await IAP.initConnection();
        const getProducts = await IAP.getProducts({ skus: itemSkus });
        setProducts(getProducts.sort((a, b) => Number(a.price) - Number(b.price)));
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    initIAP();

    return () => {
      IAP.endConnection();
    };
  }, []);

  const handlePurchase = async (sku: string) => {
    try {
      setLoading(true);
      const purchase = await IAP.requestPurchase({ sku });
      
      if (purchase) {
        const receipt = purchase.transactionReceipt;
        const transactionId = purchase.transactionId || '';
        
        // 서버에 검증 및 지급 요청
        const res = await userApi.purchaseMatchCount(
          sku,
          transactionId,
          receipt,
          Platform.OS as 'ios' | 'android'
        );

        if (res.data) {
          // 전역 유저 정보 갱신 (matchCount 등)
          login(res.data);
          Alert.alert(t('common.success'), t('purchase.success_msg', '매칭 횟수가 충전되었습니다.'));
          navigation.goBack();
        }
        
        // 결제 완료 처리 (소비성 상품)
        await IAP.finishTransaction({ purchase, isConsumable: true });
      }
    } catch (err: any) {
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert(t('common.error'), err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AMTouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </AMTouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          매칭 횟수 충전
        </AMText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Zap size={32} color="#4A90E2" />
          <AMText style={styles.infoTitle} fontWeight={700}>더 많은 대화가 필요하신가요?</AMText>
          <AMText style={styles.infoDesc}>원하는 만큼 횟수를 충전하고 자유롭게 매칭을 시작하세요.</AMText>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.productList}>
            {products.map((product) => (
              <AMTouchableOpacity 
                key={product.productId} 
                style={styles.productItem}
                onPress={() => handlePurchase(product.productId)}
              >
                <View>
                  <AMText style={styles.productName} fontWeight={600}>
                    매칭 {product.productId.split('_')[1]}회권
                  </AMText>
                  <AMText style={styles.productPrice}>{product.localizedPrice}</AMText>
                </View>
                <ShoppingCart size={20} color="#4A90E2" />
              </AMTouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, color: '#111827' },
  backButton: { padding: 8 },
  scrollContent: { padding: 20 },
  infoBox: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    marginBottom: 24,
  },
  infoTitle: { fontSize: 20, color: '#1F2937', marginTop: 16, marginBottom: 8 },
  infoDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  productList: { gap: 12 },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productName: { fontSize: 16, color: '#1F2937' },
  productPrice: { fontSize: 14, color: '#4A90E2', marginTop: 4 },
});

export default MatchPurchaseScreen;
