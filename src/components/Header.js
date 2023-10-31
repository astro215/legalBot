import { View, Text } from 'react-native'
import React from 'react'

const Header = (props) => {
  return (
    <View style = {{marginLeft:15}}>
      <Text style = {{fontWeight: '100' , fontSize:28 , fontFamily:'sans-serif'}}>
        {props.name}
      </Text>
    </View>
  )
}

export default Header