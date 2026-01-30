import React, { useState, useContext, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { CompanyContext } from '../../App';
import { getDashboardSummary } from '../services/company';

function Dashboard({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { company, setcompany } = useContext(CompanyContext);

  // Fixed state matching API exactly
  const [stats, setStats] = useState({
    total_employees: 0,
    total_vendors: 0,
    total_coupons_in_wallets: 0,
    total_coupons_redeemed_ever: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const dashboardSummary = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    
    try {
      const result = await getDashboardSummary();
      setStats(result.statistics || {});
      setRecentActivity(result.recent_activity || []);
    } catch (error) {
      console.log('Dashboard error:', error);
      if (showLoader) {
        Alert.alert('Error', 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dashboardSummary();
    }, [])
  );

  const logout = async () => {
    setMenuVisible(false);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('company');
      setcompany(null);
      navigation.replace('Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // StatCard Component - PERFECT
  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statValue}>{value || 0}</Text>
        <Text style={styles.statTitle} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );

  // Activity Item Component
  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={{ flex: 1 }}>
        <Text style={styles.activityText}>{item.description || `${item.employee_name || 'Someone'} used coupons`}</Text>
        <Text style={styles.activityDate}>
          {item.redeemed_at_formatted || item.date || 'Just now'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back, {company?.name?.split(' ')[0] || 'Admin'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          style={styles.profileBtn}
        >
          <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => dashboardSummary(false)}
            colors={['#4F46E5']}
            tintColor="#4F46E5"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.gridContainer}>
          <StatCard 
            title="Employees" 
            value={stats.total_employees} 
            icon="people-outline" 
            color="#4F46E5" 
            bgColor="#EEF2FF"
          />
          <StatCard 
            title="Vendors" 
            value={stats.total_vendors} 
            icon="storefront-outline" 
            color="#EA580C" 
            bgColor="#FFF7ED"
          />
          <StatCard 
            title="Active Coupons" 
            value={stats.total_coupons_in_wallets} 
            icon="wallet-outline" 
            color="#059669" 
            bgColor="#ECFDF5"
          />
          <StatCard 
            title="Redeemed" 
            value={stats.total_coupons_redeemed_ever} 
            icon="gift-outline" 
            color="#7C3AED" 
            bgColor="#F3E8FF"
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={56} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No recent activity</Text>
              <Text style={styles.emptyText}>Redemptions will appear here</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recentActivity.map((item, index) => (
                <ActivityItem key={item.transaction_id || index} item={item} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <Ionicons name="business-outline" size={24} color="#4F46E5" />
              <Text style={styles.menuCompany}>{company?.company_name || 'Company'}</Text>
              <Text style={styles.menuUser}>{company?.email}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutItem}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#E0E7FF',
    fontSize: 16,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  activityList: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginTop: 6,
    marginRight: 12,
  },
  activityText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    marginTop: 60,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
    marginBottom: 2,
  },
  menuUser: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 12,
  },
});

export default Dashboard;
