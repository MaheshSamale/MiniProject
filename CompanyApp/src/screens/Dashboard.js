import { StyleSheet, View, Text, TouchableOpacity,Modal
} from 'react-native'
import { useState,useContext } from 'react'
import { CompanyContext } from '../../App'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@react-native-vector-icons/ionicons'

function Dashboard() {

  const [menuVisible, setMenuVisible] = useState(false)
  const { setcompany } = useContext(CompanyContext)

  const logout = async () => {
  try {
    await AsyncStorage.removeItem('token')
    setcompany(null) 
  } catch (error) {
    console.log(error)
  }
}
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
         <Ionicons name="person-circle-outline" size={30} color="#fff" />
          {/* <Text style={styles.profileIcon}>👤</Text> */}
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dashboard Content */}
      <View style={styles.content}>
        <Text>Welcome to Dashboard</Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },

  header: {
    height: 60,
    backgroundColor: '#0b6ffd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },

  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },

  profileIcon: {
    fontSize: 26,
    color: '#fff'
  },

  overlay: {
    flex: 1
  },

  menu: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 5,
    paddingVertical: 10,
    width: 120
  },

  menuItem: {
    padding: 10,
    fontSize: 16
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Dashboard

