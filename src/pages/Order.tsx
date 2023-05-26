import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList
} from 'react-native'

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'
import { api } from '../services/api'
import ModalSelect from '../components/ModalSelect'
import ListItem from '../components/ListItem'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamsList } from '../routes/AppRoutes'


type RouteDetailParams = {
  Order: {
    table: string | number;
    order_id: string;
  }
}

export type CategoryProps = {
  id: string;
  name: string;
}

type ProductProps = {
  id: string;
  name: string;
}

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order() {
  const route = useRoute<OrderRouteProps>();

  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

  const [products, setProducts] = useState<ProductProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [amount, setAmount] = useState(1)
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    async function loadInfo() {
      const response = await api.get('/category/list')

      setCategory(response.data);
      setCategorySelected(response.data[0])

    }

    loadInfo();
  }, [])


  useEffect(() => {
    async function loadProducts() {
      if (!categorySelected?.id) {
        // Lógica para lidar com a ausência de categoria selecionada
        return;
      }

      try {
        const response = await api.get('/products', {
          params: {
            category_id: categorySelected.id
          }
        });

        setProducts(response.data);
        setProductSelected(response.data[0]);
      } catch (error) {
        console.log('Error:', error);
        console.log('Status Code:', error.response?.status);
        console.log('Error Message:', error.response?.data);
        // Trate o erro conforme necessário
      }
    }

    loadProducts();
  }, [categorySelected]);




  async function handleCloseOrder() {
    try {

      await api.delete('/order/delete', {
        params: {
          order_id: route.params?.order_id
        }
      })


      navigation.goBack();

    } catch (err) {
      console.log(err)
    }

  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }

  // adcionando um produto nessa mesa
  async function handleAdd() {
    const response = await api.post('/item/add', {
      order_id: route.params?.order_id,
      product_id: productSelected?.id,
      amount: Number(amount)
    })

    let data = {
      id: response.data.id,
      product_id: productSelected?.id as string,
      name: productSelected?.name as string,
      amount: amount
    }


    setItems(oldArray => [...oldArray, data])

  }


  async function handleDeleteItem(item_id: string) {
    await api.delete('/item/remove', {
      params: {
        item_id: item_id
      }
    })

    // após remover da api removemos esse item da nossa lista de items
    let removeItem = items.filter(item => {
      return (item.id !== item_id)
    })

    setItems(removeItem)

  }

  function handleFinishOrder() {
    navigation.navigate("FinishOrder", {
      number: route.params?.table,
      order_id: route.params?.order_id
    })
  }




  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.table}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={handleCloseOrder}>
            <Feather name="trash-2" size={28} color="#FF3F4b" />
          </TouchableOpacity>
        )}
      </View>

      {category.length !== 0 && (
        <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
          <Text style={{ color: '#FFF' }}>
            {categorySelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)} >
          <Text style={{ color: '#FFF' }}>
            {productSelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>


        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
          <TouchableOpacity style={styles.btnAddItem} onPress={() => setAmount(amount + 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>


          <TextInput
            style={[styles.input, { width: 40, textAlign: 'center' }]}
            placeholderTextColor="#F0F0F0"
            keyboardType="numeric"
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseInt(text))}
          />

          <TouchableOpacity style={[styles.btnAddItem, { marginLeft: 10 }]} onPress={() => setAmount(amount - 1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>

      </View>


      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
      />


      <Modal
        transparent={false}
        visible={modalCategoryVisible}
        animationType="fade"
      >

        <ModalSelect
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={category}
          selectedItem={handleChangeCategory}
        />

      </Modal>


      <Modal
        transparent={false}
        visible={modalProductVisible}
        animationType="fade"
      >

        <ModalSelect
          handleCloseModal={() => setModalProductVisible(false)}
          options={products}
          selectedItem={handleChangeProduct}
        />

      </Modal>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '10%',
    paddingEnd: '4%',
    paddingStart: '4%'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 14
  },
  input: {
    backgroundColor: '#101026',
    borderRadius: 4,
    width: '100%',
    height: 40,
    marginBottom: 12,
    marginLeft: 10,
    justifyContent: 'center',
    paddingHorizontal: 8,
    color: '#FFF',
    fontSize: 20,
  },
  qtdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  qtdText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonAdd: {
    width: '39%',
    backgroundColor: '#3fd1ff',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#101026',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    height: 40,
    width: '58%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnAddItem: {
    backgroundColor: '#3fd1ff',
    width: 40,
    height: 40,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  }
})