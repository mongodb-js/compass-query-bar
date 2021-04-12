import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';

import styles from './query.less';

// import 'brace/ext/language_tools';
// import 'mongodb-ace-mode';
// import 'mongodb-ace-theme-query';

// const tools = ace.acequire('ace/ext/language_tools');

import QueryItem from './query-item/query-item';

/**
 * Options for the ACE editor.
 */
// const OPTIONS = {
//   enableLiveAutocompletion: true,
//   tabSize: 2,
//   useSoftTabs: true,
//   fontSize: 11,
//   minLines: 1,
//   maxLines: 10,
//   highlightActiveLine: false,
//   showPrintMargin: false,
//   showGutter: false,
//   useWorker: false
// };

class Query extends Component {
  static displayName = 'Query';

  // static propTypes = {
  //   label: PropTypes.string.isRequired,
  //   serverVersion: PropTypes.string.isRequired,
  //   autoPopulated: PropTypes.bool.isRequired,
  //   actions: PropTypes.object.isRequired,
  //   value: PropTypes.any,
  //   onChange: PropTypes.func,
  //   onApply: PropTypes.func,
  //   placeholder: PropTypes.string,
  //   schemaFields: PropTypes.array
  // };

  // static defaultProps = {
  //   label: '',
  //   value: '',
  //   serverVersion: '3.6.0',
  //   autoPopulated: false,
  //   schemaFields: []
  // };

  state = {
    queryValue: ''
  };

  /**
   * Set up the autocompleters once on initialization.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);
    // const textCompleter = tools.textCompleter;
    // this.completer = new QueryAutoCompleter(props.serverVersion, textCompleter, props.schemaFields);
    // this.boundOnFieldsChanged = this.onFieldsChanged.bind(this);
  }

  /**
   * Subscribe on mount.
   */
  // componentDidMount() {
  //   this.unsub = this.props.actions.refreshEditor.listen(() => {
  //     this.editor.setValue(this.props.value);
  //     this.editor.clearSelection();
  //   });
  // }

  // /**
  //  * @param {Object} nextProps - The next properties.
  //  *
  //  * @returns {Boolean} If the component should update.
  //  */
  // shouldComponentUpdate(nextProps) {
  //   this.boundOnFieldsChanged(nextProps.schemaFields);
  //   return nextProps.autoPopulated || nextProps.serverVersion !== this.props.serverVersion;
  // }

  /**
   * Unsubscribe listeners.
   */
  // componentWillUnmount() {
  //   this.unsub();
  // }

  // onFieldsChanged(fields) {
  //   this.completer.update(fields);
  // }

  /**
   * Handle the changing of the query text.
   *
   * @param {String} newCode - The new query.
   */
  // onChangeQuery = (newCode) => {
  //   this.props.onChange({
  //     target: {
  //       value: newCode
  //     }
  //   });
  // };

  render() {
    // const {
    //   queryValue
    // } = this.state;

    return (
      <div
        className={styles.query}
      >
        <QueryItem />
      </div>
    );
  }
}

export default Query;
