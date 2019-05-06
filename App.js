import React, {Component} from 'react'
import {
  YellowBox, ActivityIndicator
} from 'react-native'
import firebase from 'react-native-firebase'

import {GiftedChat} from 'react-native-gifted-chat'

//react native gifted chat brings some Warnings, let's suppress them
YellowBox.ignoreWarnings(['Warning: componentWill'])

class App extends Component{
  state = {
    isAuthenticated: false,
    messages: []
  };

  componentDidMount(){
    //check if Authenticated and then get the messages from db

    firebase.auth().signInAnonymously()
      .then(() => {
        //get messages from db
        //order them by date of creation
        firebase.database().ref('chats')
          .orderByChild("createdAt")
          .on('child_added', (snap)=>{ //child_added listens to the new updates at the chats node
            let data = snap.val()

             this.setState(prev =>({
               isAuthenticated: true,
               messages: GiftedChat.append(prev.messages, data)
             }));

          })
      });
  }

  onSend(messages = []) {
    //send a new message to the db
    firebase.database().ref('/chats')
      .push(messages[0]).catch((err)=>{
        alert('failed to send message:'+err)
      })
  }

  render() {
    let {isAuthenticated} = this.state

    if (!isAuthenticated){//if not Authenticated, show a spinner
      return <ActivityIndicator />
    }

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
          name:'user',
          avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/99/UP1675-CUSA11816_00-AV00000000000012//image?_version=00_09_000&platform=chihiro&w=720&h=720&bg_color=000000&opacity=100'
        }}
      />
    );
  }
}

export default App;
