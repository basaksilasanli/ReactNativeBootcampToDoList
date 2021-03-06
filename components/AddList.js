import React, {Component} from 'react';
import {
    TextInput, 
    View, 
    StyleSheet, 
    Dimensions, 
    AsyncStorage,
} from 'react-native';
import Button from './Button';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux'
import { addToDoList, updateToDo } from '../actions'

const {width, height} = Dimensions.get('window');

let data = []
class AddList extends Component{
    state = {   
        title: '',
        description: '' ,
       
    }

    async componentDidMount() {
        if(this.props.index > -1) {
            const { title, desc } = this.props.tasks[this.props.index];
            this.setState({
                title,
                description:desc
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Typical usage (don't forget to compare props):
       console.log(prevProps, prevState, snapshot)
      }

    async UNSAFE_componentWillReceiveProps(nextprops) {
        if(nextprops.isCreate){
            const array = JSON.stringify(nextprops.tasks)
            await AsyncStorage.setItem('key7', array)
            Actions.pop();
        
            
        }
        if(nextprops.isUpdate) {
            const array = JSON.stringify(nextprops.tasks)
            await AsyncStorage.setItem('key7', array)
            Actions.pop()
            Actions.refresh({key: Math.random()})
        }
    }

    saveToList = () => {
        const params = { 
            title: this.state.title,
            desc: this.state.description,
        };

        if (this.props.index>-1) {
            this.props.updateToDo({index:this.props.index,title: params.title, desc:params.desc })
        }
        else {
            this.props.addToDoList(params) 

        }
    }

    render() {
        return(
            <View style = {styles.container}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(title) => this.setState({title})}
                    placeholder={'Başlık'}
                    value = {this.state.title}

                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(description) => this.setState({description})}
                    placeholder={'Açıklama'}
                    value={this.state.description}
                    
                />
                <Button text="Add" onClick={() => { this.saveToList()}
                }/>

            </View>

        )
    }

}


const styles = StyleSheet.create( {
    container: {
        flex: 9,
        justifyContent: "center", 
        alignItems: "center",
        width,
    },
    textInput: {
        height: 40,
        borderColor: 'gray', 
        borderWidth: 1, 
        width: width*0.9,
        marginBottom: 10

    }    

});


const mapStateToProps = ({ ToDoListResponse }) => {
    console.log(ToDoListResponse)
    return { 
        tasks: ToDoListResponse.tasks, 
        isCreate: ToDoListResponse.isCreate,
        isUpdate: ToDoListResponse.isUpdate 
    }
};

export default connect(mapStateToProps, { addToDoList , updateToDo})(AddList);
