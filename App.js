import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { fromJS } from 'immutable';

import Deck from './src/Deck';
import AppStyles from './styles';

const data = fromJS([
  { id: 1, text: 'Card #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 2, text: 'Card #2', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 3, text: 'Card #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 4, text: 'Card #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
]);

class App extends Component {
  state = { data: data };

  /**
   * renderCard
   */
  renderCard = (data) => (
    <Card
      key={data.get('id')}
      image={{ uri: data.get('uri') }}
      containerStyle={styles.card}
    >
      <Text style={styles.title}>{data.get('text')}</Text>
      <Text style={styles.decription}>
        Cards can have a title and a description
      </Text>
      <Button
        icon={{ name: 'local-see',type: 'MaterialIcons' }}
        backgroundColor='#03A9F4'
        title='VIEW NOW' 
      />
    </Card>
  )

  /**
   * renderEmptyScreen
   */
  renderEmptyScreen = (data) => (
    <Card containerStyle={styles.emptyScreen}>
      <Text style={{ 
        color: 'grey',
        fontSize: 20,
        textAlign: 'center',
        marginTop: '50%',
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
      }}
      >
        Guess you are out of Cards! Hit refresh button to get new ones
      </Text>
      <Button
        title='REFRESH' 
        icon={{ name: 'refresh' }}
        backgroundColor='#03A9F4'
        onPress={this.resetCardsData}
      />
    </Card>
  )
  /**
   * deleteCard
   * @param {Immutable.List} data list of cards data
   */
  deleteCard = (data) => {
    this.state.data.shift();
  }

  /**
   * onSwipeRight
   * @param {Immutable.List} data list of cards data
   * @emits {func} deleteCard
   */
  onSwipeRight = (data) => this.deleteCard(data);

  /**
   * onSwipeLeft
   * @param {Immutable.List} data list of cards data
   * @emits {func} deleteCard
   */
  onSwipeLeft = (data) => this.deleteCard(data);

  /**
   * resetCardsData
   */
  resetCardsData = () => { this.setState({ data: data }) };

  /**
   * render
   * @return {ReactElement}
   */
  render() {
    return (
      <View style={styles.container}>
        <Deck 
          data={this.state.data} 
          renderEmptyScreen={this.renderEmptyScreen}
          renderCard={this.renderCard}
          deleteCard={this.deleteCard}
          onSwipeRight={this.onSwipeRight}
          onSwipeLeft={this.onSwipeLeft}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create(AppStyles);

export default App;
