import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CategoryProps } from '../pages/Order'
import { TableProps } from '../pages/Dashboard'


interface ModalSelectProps{

  options: CategoryProps[]
  handleCloseModal: () => void
  selectedItem: (item: CategoryProps ) => void
}

const { width: width_window, height: height_window} = Dimensions.get('window')

const ModalSelect = ({handleCloseModal, options, selectedItem}: ModalSelectProps) => {

  function onPressItem(item: CategoryProps){
    selectedItem(item)
    handleCloseModal()
  }



  const option = options.map((item, index)=> (
    <TouchableOpacity key={index} style={styles.option} onPress={ () => { onPressItem(item)} }>
      <Text style={styles.item}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ))

  return (
    <TouchableOpacity onPress={handleCloseModal} style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {option}
        </ScrollView>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d1d2e'

  },

  content:{
    width: width_window - 20,
    height: height_window / 2,
    backgroundColor: '#1d1d2e',
    borderColor: '#8a8a8a',
    borderRadius: 4
  },

  option: {
    alignItems: 'flex-start',
    borderTopWidth: 0.8,
    borderTopColor: '#8a8a8a',

  },

  item: {
    margin: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  }
})


export default ModalSelect