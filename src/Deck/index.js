import React, { Component } from 'react';
import { 
  View,
  Dimensions,
  Animated, 
  StyleSheet,
  PanResponder,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DeckStyles from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_MOVE_X = 2 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 400;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  }
  static propTypes = {
    data: ImmutablePropTypes.list.isRequired,
    renderEmptyScreen: PropTypes.func.isRequired,
    renderCard: PropTypes.func.isRequired,
    onSwipeRight: PropTypes.func,
    onSwipeLeft: PropTypes.func,
  }

  constructor(props){
    super(props);
    // set initial position
    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
    });
    // set current card index to display
    this.state = { index: 0 };
  }

  componentWillUpdate() {
    // Enable Layout Animation on Android
    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
    // Animate any layout animation with spring effect
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ index: 0 });
  }

  /**
   * onStartShouldSetPanResponder
   */
  onStartShouldSetPanResponder = () => true

  /**
   * onPanResponderMove
   * @param {Event} event
   * @param {object} gesture
   * @prop {number} gesture.dx
   * @prop {number} gesture.dy 
   */
  onPanResponderMove = (event, { dx, dy }) => {
    this.position.setValue({ x: dx, y: dy });
  }

  /**
   * onPanResponderRelease
   * @param {Event} event
   * @param {object} gesture
   * @prop {number} gesture.dx
   */
  onPanResponderRelease = (event, { dx }) => {
    if (dx > SWIPE_THRESHOLD) {
      return this.swipeOutCard(this.position, 'right');
    } else if (dx < -SWIPE_THRESHOLD) {
      return this.swipeOutCard(this.position, 'left');
    }

    return this.resetCardPosition(this.position)
  }

  /**
   * getCardStyle
   * @param {number} i current card index
   * @return {object|null} updated position layout of the card
   */
  getCardStyle = (i) => {
    const rotate = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5 ],
      outputRange: [ '-120deg', '0deg', '120deg' ]
    });

    if(i === 0) {
      return {
        ...this.position.getLayout(),
        transform:[{ rotate }],
        zIndex: 9000,
        top: 0
      }
    }

    return { top: 10 * i };
  }

  /**
   * getPanHandler
   * @param {number} i current card index
   * @return {object|null} if card is first item, return a set of panHandlers
   */
  getPanHandlers = (i) => {
    if (i === 0) {
      return this.panResponder.panHandlers;
    }

    return null;
  }
  
  /**
   * isEmpty
   * @param {Immutable.List} data cards list
   * @param {number} index displayed card index
   * @return {boolean} true if index is greater than the size of the list
   */
  isEmpty = (data, index) => index >= data.size

  /**
   * onSwipeComplete
   * @param {string} direction swipe out direction 'right' | 'left'
   */
  onSwipeComplete = (direction) => {
    const { index } = this.state;
    const { data, deleteCard } = this.props;
    this.swipeAction(data, direction);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: index + 1 });
  }

  /**
   * swipeOutCard
   * @param {object} direction card swipe direction
   */
  swipeOutCard = (position, direction) => {
    const x = direction === 'right' ? SWIPE_OUT_MOVE_X : -SWIPE_OUT_MOVE_X
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeComplete(direction));
  }

  /**
   * swipeAction
   * @param {Immutable.List} data cards list
   * @param {object} direction card swipe direction
   */
  swipeAction = (data, direction) => {
    if (direction === 'right') {
      return this.props.onSwipeRight(data);
    }

    return this.props.onSwipeLeft(data);
  }
  
   /**
   * resetCardPosition
   * @param {object} position card current position
   */
  resetCardPosition = (position) => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  /**
   * render
   * @return {ReactElement}
   */
  render() {
    const { data, renderCard, renderEmptyScreen } = this.props;
    const { index } = this.state;
    if (this.isEmpty(data, index)) { return renderEmptyScreen(); }

    return (
      <View style={styles.container}>
        {data
          .filter((card, i) => i >= index )
          .map((card, i) => (
            <Animated.View
              key={card.get('id')} 
              style={this.getCardStyle(i)}
              {...this.getPanHandlers(i)}
            >
              {renderCard(card)}
            </Animated.View>
          ))
          .reverse()}
      </View>
    );
  }
}

const styles = StyleSheet.create(DeckStyles);

export default Deck;