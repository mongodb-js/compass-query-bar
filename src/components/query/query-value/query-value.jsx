import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';

import styles from './query-value.less';
// import FontAwesome from 'react-fontawesome';

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

// const

const LOGICAL_QUERY_OPERATORS = {
  '$or': {
    id: '$or',
    title: '$or',
    description: 'Perform a logical OR operation on an array of two or more <expressions> and select the document(s) that satisfy at least one of the <expressions>'
  },
  '$and': {
    id: '$and',
    title: '$and',
    description: 'Performs a logical AND operation on an array of two or more <expressions> and select the document(s) that satisfy all of the <expressions>'
  },
  '$not': {
    id: '$not',
    title: '$not'
  },
  '$nor': {
    id: '$nor',
    title: '$nor'
  }
};

const COMPARISON_OPERATORS = {
  '$eq': {
    id: '$eq',
    title: '$eq',
    description: 'Matches values that are equal to a specified value.'
  },
  '$gt': {
    id: '$gt',
    title: '$gt',
    description: 'Matches values that are greater than a specified value.'
  },
  '$gte': {
    id: '$gte',
    title: '$gte',
    description: 'Matches values that are greater than or equal to a specified value.'
  },
  '$in': {
    id: '$in',
    title: '$in',
    description: 'Matches any of the values specified in an array.'
  },
  '$lt': {
    id: '$lt',
    title: '$lt',
    description: 'Matches values that are less than a specified value.'
  },
  '$lte': {
    id: '$lte',
    title: '$lte',
    description: 'Matches values that are less than or equal to a specified value.'
  },
  '$ne': {
    id: '$ne',
    title: '$ne',
    description: 'Matches all values that are not equal to a specified value.'
  },
  '$nin': {
    id: '$nin',
    title: '$nin',
    description: 'Matches none of the values specified in an array.'
  },
};

const GEOSPATIAL_OPERATORS = {
  $geoIntersects: {
    id: '$geoIntersects',
    title: '$geoIntersects',
    description: 'Selects geometries that intersect with a GeoJSON geometry. The 2dsphere index supports $geoIntersects.'
  },
  $geoWithin: {
    id: '$geoWithin',
    title: '$geoWithin',
    description: 'Selects geometries within a bounding GeoJSON geometry. The 2dsphere and 2d indexes support $geoWithin.'
  },
  $near: {
    id: '$near',
    title: '$near',
    description: 'Returns geospatial objects in proximity to a point. Requires a geospatial index. The 2dsphere and 2d indexes support $near.'
  },
  $nearSphere: {
    id: '$nearSphere',
    title: '$nearSphere',
    description: 'Returns geospatial objects in proximity to a point on a sphere. Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.'
  }
};

const valueTypeOptions = {
  LOGICAL_QUERY_OPERATOR: {
    id: 'LOGICAL_QUERY_OPERATOR',
    title: 'Logical Operator',
    options: LOGICAL_QUERY_OPERATORS
  },
  COMPARISON_QUERY_OPERATOR: {
    id: 'COMPARISON_QUERY_OPERATOR',
    title: 'Comparison Operator',
    options: COMPARISON_OPERATORS
  },
  GEOSPATIAL_OPERATOR: {
    id: 'GEOSPATIAL_OPERATOR',
    title: 'Geospatial Operator',
    options: GEOSPATIAL_OPERATORS
  },
  DATE_TYPE: {
    id: 'DATE_TYPE',
    title: 'Date'
  }
};

class QueryValue extends Component {
  static displayName = 'QueryValue';

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
    queryValue: 'query value'
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

  onClickValueOption = (e, id) => {
    e.preventDefault();

    if (id) {
      this.setState({
        expanded: false,
        queryValue: id
      });
    }
  }

  renderNestedValueOption(nestedValueOption) {
    const {
      title,
      id,
      // description
    } = nestedValueOption;

    return (
      <li
        className={styles['query-value-option']}
        key={`${id}-nested-value-option`}
      >
        <a
          className={styles['query-value-option-link']}
          href="#"
          onClick={(e) => this.onClickValueOption(e, id)}
        >
          {title}
        </a>
      </li>
    );
  }

  renderNestedValueOptions(valueOption) {
    const {
      id,
      options
    } = valueOption;
    // console.log('options', options);

    return (
      <ul
        className={styles['query-nested-value-options']}
        key={`${id}-value-options`}
      >
        {Object.values(options).map(
          option => this.renderNestedValueOption(option)
        )}
      </ul>
    );
  }

  renderValueOption(valueOption) {
    const {
      title,
      id,
      options = null
    } = valueOption;

    return (
      <li
        className={styles['query-value-option']}
        key={id}
      >
        <a
          className={styles['query-value-option-link']}
          href="#"
          onClick={(e) => this.onClickValueOption(
            e,
            (options ? null : id)
          )}
        >
          {title}
        </a>
        {!!options && this.renderNestedValueOptions(valueOption)}
      </li>
    );
  }

  renderExpanded() {
    return (
      <ul
        className={styles['query-value-picker']}
      >
        {Object.values(valueTypeOptions).map(
          valueOption => (
            valueOption.options
              ? this.renderValueOption(valueOption)
              : this.renderNestedValueOption(valueOption)
          )
        )}
        {/* <div>
          Logical Operator ($or, $and, $not, $nor)
        </div>
        <div>
          Comparison ($gt, $lt, $in...)
        </div>
        <div>
          $exists
        </div>
        <div>
          $type
        </div>
        <div>
          Date
        </div>
        <div>
          Binary (Image picker?)
        </div>
        <div>
          Geospatial ($geoWithin, $near)
        </div>
        <div>
          Evaluation ($expr, $regex, $text...)
        </div>
        <div>
          Array
        </div> */}
      </ul>
    );
  }

  render() {
    const {
      expanded,
      queryValue
    } = this.state;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    return (
      <div
        className={styles['query-value']}
      >
        <input
          type="text"
          className={styles['query-value-input']}
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
        {expanded && this.renderExpanded()}
      </div>
    );
  }
}

export default QueryValue;
