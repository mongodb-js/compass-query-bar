import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EJSON } from 'bson';

import styles from './query.less';

import QueryItem from './query-item/query-item';

// Innefficient but seems to work lol
function replaceKeyInSameSpot(objToCopy, currentIndex, newIndex, newValue) {
  let newObject = {};

  Object.entries(objToCopy).forEach(([field, value]) => {
    if (field === currentIndex) {
      newObject = {
        ...newObject,
        [newIndex]: newValue
      };
    } else {
      newObject = {
        ...newObject,
        [field]: value
      };
    }
  });

  return newObject;
}

class Query extends Component {
  static displayName = 'Query';

  static propTypes = {
    // label: PropTypes.string.isRequired,
    serverVersion: PropTypes.string.isRequired,
    // autoPopulated: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onApply: PropTypes.func,
    placeholder: PropTypes.string,
    schemaFields: PropTypes.array
  };

  static defaultProps = {
    label: '',
    value: '',
    serverVersion: '3.6.0',
    // autoPopulated: false,
    schemaFields: []
  };

  state = {
    query: {
      'field': 'value'
    }
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

  onChangeQuery = (queryObj) => {
    let newCode = '';
    try {
      newCode = EJSON.stringify(queryObj);
      // newCode = JSON.stringify(queryObj);
    } catch (e) {
      console.log('unable to parse query as json:', e);
    }

    this.props.onChange({
      target: {
        value: newCode
      }
    });
  };

  onChangeQueryItemValue = (index, newValue) => {
    const newQuery = {
      ...this.state.query,
      [index]: newValue
    };
    this.setState({
      query: newQuery
    });

    this.onChangeQuery(newQuery);
  }

  renameAndUpdateQueryItem = (currentIndex, newIndex, newValue) => {
    const newQuery = replaceKeyInSameSpot(
      this.state.query,
      currentIndex,
      newIndex,
      newValue
    );

    this.setState({
      query: newQuery
    });

    this.onChangeQuery(newQuery);
  }

  onRenameQueryItem = (currentIndex, newIndex) => {
    const newQuery = replaceKeyInSameSpot(
      this.state.query,
      currentIndex,
      newIndex,
      this.state.query[currentIndex]
    );

    this.setState({
      query: newQuery
    });

    this.onChangeQuery(newQuery);
  }

  onRemoveQueryItem = (index) => {
    const newQuery = {
      ...this.state.query
    };

    delete newQuery[index];

    this.setState({
      query: newQuery
    });

    this.onChangeQuery(newQuery);
  }

  onAddQueryItem = () => {
    let newFieldName = 'new field';
    if (this.state.query[newFieldName]) {
      let counter = 1;
      while (!!this.state.query[`new field ${counter}`]) {
        counter++;
      }
      newFieldName = `new field ${counter}`;
    }

    const newQuery = {
      ...this.state.query,
      [newFieldName]: 'new value'
    };

    // TODO: Check that new field doesn't exist.

    this.setState({
      query: newQuery
    });

    this.onChangeQuery(newQuery);
  }
  // .sort(
  //           (fieldA, fieldB) => fieldA[0].localeCompare(fieldB[0])
  //         )
  render() {
    // const {
    //   query
    // } = this.state;

    const {
      schemaFields,
      value
    } = this.props;

    let query = {};
    try {
      console.log('ok');
      query = EJSON.parse(value);
    } catch (err) {
      console.log('unable to parse existing query:', err);
    }

    // console.log('value', value);
    // console.log('target val', value.target.value);

    return (
      <div
        className={styles.query}
      >
        {Object.entries(query).map(
          ([field, fieldValue], index) => (
            <QueryItem
              key={`${index}`}
              path={field}
              field={field}
              value={fieldValue}
              // queryItem={query}
              schemaFields={schemaFields}
              onChangeQueryItemValue={this.onChangeQueryItemValue}
              onRemoveQueryItem={this.onRemoveQueryItem}
              onRenameQueryItem={this.onRenameQueryItem}
              onAddQueryItem={this.onAddQueryItem}
              renameAndUpdateValue={this.renameAndUpdateQueryItem}
            />
          )
        )}
        <div>
          <button
            className={styles['query-add-another-item']}
            onClick={this.onAddQueryItem}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}

export default Query;
