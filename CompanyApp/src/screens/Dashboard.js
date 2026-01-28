import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StatusBar,
  RefreshControl,
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { useFocusEffect } from '@react-navigation/native';
import { CompanyContext } from '../../App';
import { getDashboardSummary } from '../services/company';

function Dashboard({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { company, setcompany } = useContext(CompanyContext);

  // Default state matching your API structure
  const [stats, setStats] = useState({
    total_employees: 0,
    total_vendors: 0,
    total_coupons_in_wallets: "0",
    total_coupons_redeemed_ever: "0"
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const dashboardSummary = async () => {
    setLoading(true);
    try {
      const result = await getDashboardSummary();
      if (result.status === "success") {
        setStats(result.data.statistics);
        setRecentActivity(result.data.recent_activity || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      dashboardSummary();
    }, [])
  );

  const logout = async () => {
    setMenuVisible(false);
    try {
      await AsyncStorage.removeItem('token');
      setcompany(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Helper component for Stat Cards
  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back, {company?.name || 'Admin'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <View style={styles.profileBtn}>
            <Ionicons name="person" size={20} color="#4F46E5" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={dashboardSummary} />}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Statistics Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.gridContainer}>
          <StatCard 
            title="Employees" 
            value={stats.total_employees} 
            icon="people" 
            color="#4F46E5" 
            bgColor="#EEF2FF"
          />
          <StatCard 
            title="Vendors" 
            value={stats.total_vendors} 
            icon="storefront" 
            color="#EA580C" 
            bgColor="#FFF7ED"
          />
          <StatCard 
            title="Active Coupons" 
            value={stats.total_coupons_in_wallets} 
            icon="wallet" 
            color="#059669" 
            bgColor="#ECFDF5"
          />
          <StatCard 
            title="Redeemed" 
            value={stats.total_coupons_redeemed_ever} 
            icon="gift" 
            color="#7C3AED" 
            bgColor="#F5F3FF"
          />
        </View>

        {/* Recent Activity Section */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="documents-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No recent activity found</Text>
            </View>
          ) : (
            recentActivity.map((item, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>{item.description || "Activity logged"}</Text>
                <Text style={styles.activityDate}>{item.date || "Just now"}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Logout Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
               <Text style={styles.menuUser}>{company?.email}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{marginRight: 10}} />
              <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
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
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5', // Indigo primary
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#E0E7FF',
    fontSize: 14,
    marginTop: 4,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%', // Approx half width
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 10,
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // Menu Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    width: 200,
    overflow: 'hidden',
  },
  menuHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  menuUser: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Dashboard;