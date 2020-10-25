import React, {Component} from 'react';
import {View, ViewPropTypes, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {shouldUpdate} from '../../../component-updater';
import Dot from '../../dot';
import styleConstructor from './style';

const viewPropTypes =
  typeof document !== 'undefined' ? PropTypes.shape({style: PropTypes.object}) : ViewPropTypes || View.propTypes;

class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),
    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,
    disableAllTouchEventsForDisabledDays: PropTypes.bool,
    renderUnderDayView: PropTypes.func,
    dayContainerStyle: viewPropTypes.style,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      'state',
      'children',
      'marking',
      'onPress',
      'onLongPress',
      'renderUnderDayView',
    ]);
  }

  render() {
    const {theme, disableAllTouchEventsForDisabledDays, renderUnderDayView, date, dayContainerStyle} = this.props;
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      };
    }

    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
    const isToday = this.props.state === 'today';

    const {marked, dotColor, selected, selectedColor, selectedTextColor, activeOpacity, disableTouchEvent} = marking;

    if (selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);

      if (selectedColor) {
        containerStyle.push({backgroundColor: selectedColor});
      }

      if (selectedTextColor) {
        textStyle.push({color: selectedTextColor});
      }
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (isToday) {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    let shouldDisableTouchEvent = false;
    if (typeof disableTouchEvent === 'boolean') {
      shouldDisableTouchEvent = disableTouchEvent;
    } else if (typeof disableAllTouchEventsForDisabledDays === 'boolean' && isDisabled) {
      shouldDisableTouchEvent = disableAllTouchEventsForDisabledDays;
    }

    return (
      <View style={[this.style.dayContainer, dayContainerStyle]}>
        <TouchableOpacity
          testID={this.props.testID}
          style={containerStyle}
          onPress={this.onDayPress}
          onLongPress={this.onDayLongPress}
          activeOpacity={activeOpacity}
          disabled={shouldDisableTouchEvent}
          accessibilityRole={isDisabled ? undefined : 'button'}
          accessibilityLabel={this.props.accessibilityLabel}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        >
          <Text allowFontScaling={false} style={textStyle}>
            {String(this.props.children)}
          </Text>
          <Dot
            theme={theme}
            isMarked={marked}
            dotColor={dotColor}
            isSelected={selected}
            isToday={isToday}
            isDisabled={isDisabled}
          />
        </TouchableOpacity>
        {!!renderUnderDayView && renderUnderDayView(date)}
      </View>
    );
  }
}

export default Day;
