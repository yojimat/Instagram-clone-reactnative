import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";

const Tab = createMaterialBottomTabNavigator()
const EmptyScreen = () => null

const materialIconFunction = (name) => {
    return ({ color }) =>
        <MaterialCommunityIcons name={name} color={color} size={26} />
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser()
    }
    render() {
        const { currentUser } = this.props
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed"
                    options={{
                        tabBarIcon: materialIconFunction("home")
                    }}
                    component={FeedScreen} />
                <Tab.Screen name="AddContainer"
                    listeners={({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault()
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: materialIconFunction("plus-box")
                    }}
                    component={EmptyScreen} />
                <Tab.Screen name="Profile"
                    options={{
                        tabBarIcon: materialIconFunction("account-circle")
                    }}
                    component={ProfileScreen} />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = store => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) =>
    bindActionCreators({ fetchUser }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
