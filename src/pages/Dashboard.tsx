import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native"

import { StackParamsList } from "../routes/AppRoutes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { api } from "../services/api";
import ModalTable from "../components/ModalTable";

export type TableProps = {
  id: string;
  number: number;
}



const Dashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { signOut } = useContext(AuthContext);


  const [tables, setTables] = useState<TableProps[] | []>([]);
  const [tableSelected, setTableSelected] = useState<TableProps | undefined>()
  const [modalTableVisible, setModalTableVisible] = useState(false)

  function handleChangeTable(item: TableProps) {
    setTableSelected(item);
  }



  useEffect(() => {
    async function loadInfo() {
      const response = await api.get('/tables')

      setTables(response.data);
      setTableSelected(response.data[0])

    }

    loadInfo();
  }, [])



  async function handleSubmit() {


    const response = await api.post('/order/create', {
      table_id: tableSelected.id
    })



    navigation.navigate('Order', { table: tableSelected.number, order_id: response.data.id })  
  }

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnClose} onPress={signOut}>
          <Text style={[styles.btnText, { marginLeft: 10 }]}>
            <Feather name='arrow-left' size={30} color={'#fff'} />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.title}>Novo Pedido</Text>

        <View style={styles.inputWrapper}>

          <TouchableOpacity style={styles.input} onPress={() => setModalTableVisible(true)}>
            <Text style={{ color: '#fff' }}>
              Mesa: {tableSelected?.number}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Abrir Mesa</Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={modalTableVisible}
          animationType="fade"
        >
          <ModalTable handleCloseModal={() => setModalTableVisible(false)} options={tables} selectedItem={handleChangeTable} />
        </Modal>



      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'flex-start',
    backgroundColor: "#1d1d2e",
  },


  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 40,
  },

  btnText: {
    fontWeight: "bold",
  },

  btnClose: {
    width: 40,
    height: 40,
    position: 'relative',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  main: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 50
  },
  title: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },

  inputWrapper: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 32,
  },

  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#101026",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },

  btn: {
    width: "95%",
    marginTop: 8,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3fffa3",
  },


});

export default Dashboard;
