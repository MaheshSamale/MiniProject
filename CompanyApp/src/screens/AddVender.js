import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import Button from '../components/Button'
import { registerVendor } from '../services/company'

function AddVendor({navigation}) {
      const [name, setName] = useState('')
      const [email, setEmail] = useState('')
      const [phone, setPhone] = useState('')
      const [password, setPassword] = useState('')
      const [location, setLocation] = useState('')

   const handleRegister = async () => {
      if(!name || !email || !phone || !password || !location) {
          Alert.alert('Error', 'Please fill all fields');
          return;
      }
       const result = await registerVendor(name, email, phone, password, location);
       if (result.status == 'success') {
           Alert.alert('Vendor added successfully');
           navigation.goBack();
       }
        else
            Alert.alert('Error', result.error);
   }

  return (
   <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.signinContainer}>
                    <Text style={styles.signin}>Add Vendor</Text>
                </View>

                <TextInput
                    style={styles.input}
                    value={name}
                    label='Name'
                    placeholder='enter your name here'
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    marginTop={10}
                    label='Email'
                    placeholder='enter your email here'
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    marginTop={10}
                    secureTextEntry={true}
                    label='Password'
                    placeholder='enter your password here'
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    value={phone}
                    marginTop={10}
                    label='Phone'
                    placeholder='enter your phone number here'
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    value={location}
                    marginTop={10}
                    label='Location'
                    placeholder='enter your location here'
                    onChangeText={setLocation}
                />
            <View style={styles.buttonContainer}>
              <Button
                    title='Add Vendor'
                    onPress={handleRegister}
                />
                <TouchableOpacity
                   style={styles.cancelButton}
                   onPress={() => {navigation.goBack()}}
                >
                    <Text style={styles.title}>Cancel</Text>
                </TouchableOpacity>
            </View>
                
            </View>
        </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b6ffd',
        justifyContent: 'center',
    },
    input: {
        borderRadius: 5,
        borderColor: 'lightgray',
        borderStyle: 'solid',
        borderWidth: 1,
        marginTop: 5,
        paddingHorizontal: 15,
    },
    innerContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    signinContainer: {
        marginTop: -40,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signin: {
        textAlign: 'center',
        backgroundColor: '#198754',
        width: 150,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 15,
        borderRadius: 8,
        elevation: 5,
    },
    text: {
        marginTop: 20,
        fontSize: 17,
    },
    signinHere: {
        fontWeight: 'bold',
        color: '#0b6ffd',
    },
    signinHereContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
       backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    },
    title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})
export default AddVendor
