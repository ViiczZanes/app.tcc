import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRoute, RouteProp, useNavigation} from '@react-navigation/native'
import { api } from '../services/api'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamsList } from '../routes/AppRoutes'

type RouteDetailParams = {
  FinishOrder: {
    number: string | number
    order_id: string
  }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>


const FinishOrder = () => {

  const route = useRoute<FinishOrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>()

  async function handleFinish() {
    try {
      await api.put('/order/draft', {
        order_id: route.params?.order_id
      })

      navigation.popToTop();
      
    } catch (err) {
      console.log('Erro ao Finalizar')
    }
  }
  

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Voce Deseja Finalizar Esse Pedido ?</Text>
        <Text style={styles.table}>Mesa {route.params?.number}</Text>

        <TouchableOpacity style={styles.btn} onPress={handleFinish}>
          <Text style={styles.btnText}>
            Finalizar Pedido
          </Text> 
          <Feather name='shopping-cart' size={20} color={'#1d1d2e'}/>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1d1d2e',
      paddingVertical: '5%',
      paddingHorizontal: '4%',
      alignItems: 'center',
      justifyContent: 'center'

    },

    title: {
      color: "#fff",
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12, 
    },
    
    table: {
      color: "#fff",
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 12, 
    },

    btn: {
      backgroundColor: '#3fffa3',
      flexDirection: 'row',
      width: '65%',
      height: 40,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
    },

    btnText: {
      fontSize: 18,
      marginRight: 8,
      fontWeight: 'bold',
      color: '#1d1d2e',
    }
})

export default FinishOrder