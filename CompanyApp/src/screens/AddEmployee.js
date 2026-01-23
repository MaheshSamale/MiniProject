import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Modal, Pressable } from 'react-native'
import { useState } from 'react'
import Button from '../components/Button'
import { registerEmployee } from '../services/company'
import * as Clipboard from 'expo-clipboard'

function AddEmployee({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [employee_code, setEmployeeCode] = useState('')
    const [department, setDepartment] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [employeeCredentials, setEmployeeCredentials] = useState(null)

    const copyCredentials = async () => {
        if (!employeeCredentials) return

        const text =
            `Email: ${employeeCredentials.credentials.email}\n` +
            `Password: ${employeeCredentials.credentials.password}`

        await Clipboard.setStringAsync(text)
        Alert.alert('Copied', 'Employee credentials copied')
    }

    const handleRegister = async () => {
        if (!name || !email || !password || !employee_code || !department) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }

        const result = await registerEmployee(
            name,
            email,
            password,
            employee_code,
            department
        )

        if (result.status === 'success') {
            setEmployeeCredentials(result.data)
            setModalVisible(true)
        } else {
            Alert.alert('Error', result.error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.signinContainer}>
                    <Text style={styles.signin}>Add Employee</Text>
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
                    value={employee_code}
                    marginTop={10}
                    label='Employee Code'
                    placeholder='enter your employee code here'
                    onChangeText={setEmployeeCode}
                />
                <TextInput
                    style={styles.input}
                    value={department}
                    marginTop={10}
                    label='Department'
                    placeholder='enter your department here'
                    onChangeText={setDepartment}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title='Add Employee'
                        onPress={handleRegister}
                    />
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => { navigation.goBack() }}
                    >
                        <Text style={styles.title}>Cancel</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>✅ Employee Added</Text>

                        <Text style={styles.modalText}>
                            {employeeCredentials?.message}
                        </Text>

                        <View style={styles.credentialsBox}>
                            <Text style={styles.credText}>
                                📧 Email: {employeeCredentials?.credentials.email}
                            </Text>
                            <Text style={styles.credText}>
                                🔑 Password: {employeeCredentials?.credentials.password}
                            </Text>
                        </View>

                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false)
                                navigation.goBack()
                            }}
                        >
                            <Pressable style={styles.copyButton} onPress={copyCredentials}>
                                <Text style={styles.copyButtonText}>📋 Copy Credentials</Text>
                            </Pressable>


                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        padding: 20,
        borderRadius: 12,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#198754',
    },
    modalText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 15,
    },
    credentialsBox: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    credText: {
        fontSize: 15,
        marginBottom: 5,
    },
    modalButton: {
        backgroundColor: '#0b6ffd',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    copyButton: {
        backgroundColor: '#198754',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    copyButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },


})
export default AddEmployee
