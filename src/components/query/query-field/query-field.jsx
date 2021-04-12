import React, { Component } from 'react';
// import FontAwesome from 'react-fontawesome';
// import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';

import styles from './query-field.less';

// import 'brace/ext/language_tools';
// import 'mongodb-ace-mode';
// import 'mongodb-ace-theme-query';

// const tools = ace.acequire('ace/ext/language_tools');

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

class QueryField extends Component {
  static displayName = 'QueryField';

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
    expanded: false,
    queryValue: 'query field'
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
    const {
      expanded,
      queryValue
    } = this.state;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    return (
      <div
        className={styles['query-field']}
      >
        <input
          type="text"
          className={styles['query-field-input']}
          value={queryValue}
          onChange={e => {
            this.setState({ queryValue: e.target.value });
          }}
        />
        <button
          className={styles['query-field-dropdown-button']}
          onClick={() => { this.setState({ expanded: !expanded }); }}
        >
          {expanded ? 'V' : '>'}
          {/* <FontAwesome fixedWidth name={symbol} /> */}
        </button>
      </div>
    );
  }
}

export default QueryField;
