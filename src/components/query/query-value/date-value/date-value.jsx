import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

import styles from './date-value.less';

// const dateRegex = new RegExp('Date\(.*\)$');
// function getDateStringFromString(value) {
//   const regex = /Date\(['`"](.*)['`"]\)$/g;
//   // console.log('exec', regex.exec(value));
//   return regex.exec(value)[1];
// }

// console.log('getdate', getDateStringFromString(
//   'Date(\'2021-04-06T00:00:00-04:00\')'
// ));

class DateValue extends Component {
  static displayName = 'DateValue';

  static propTypes = {
    onChangeQueryValue: PropTypes.func.isRequired,
    queryValue: PropTypes.string.isRequired
  };

  onDateValueChange = (momentDateObject) => {
    console.log('formatted date change', momentDateObject.format());

    this.props.onChangeQueryValue(momentDateObject.format());
  }

  // renderInput( props, openCalendar, closeCalendar ) {
  //   // function clear(){
  //   //   props.onChange({target: {value: ''}});
  //   // }
  //   return (
  //     <div>
  //       {/* <input {...props} /> */}
  //       {/* <button onClick={openCalendar}>open calendar</button>
  //       <button onClick={closeCalendar}>close calendar</button> */}
  //       {/* <button onClick={clear}>clear</button> */}
  //     </div>
  //   );
  // }

  render() {
    const {
      queryValue
    } = this.props;

    // console.log('datequeryValue', queryValue);

    let datetimeValue;
    try {
      datetimeValue = new Date(queryValue);
    } catch (e) {
      console.log('get date failed for string', queryValue);
      return null;
    }

    // console.log('datetimeValue', datetimeValue);

    return (
      <div
        className={styles['date-value-picker']}
      >
        <Datetime
          input={false}
          open
          value={datetimeValue}
          onChange={this.onDateValueChange}
          // renderInput={this.renderInput}
        />
      </div>
    );
  }
}

export default DateValue;
