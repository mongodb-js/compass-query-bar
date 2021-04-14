import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';
// import FontAwesome from 'react-fontawesome';

// import 'brace/ext/language_tools';
// import 'mongodb-ace-mode';
// import 'mongodb-ace-theme-query';

import styles from './query-value.less';
import DateValue from './date-value/date-value';
import Minichart from '../../schema/minichart';

const dateRegex = new RegExp('Date\(.*\)$');
function isDate(value) {
  return dateRegex.test(`${value}`);
}

// const LOGICAL_QUERY_OPERATORS = {
//   '$or': {
//     id: '$or',
//     title: '$or',
//     description: 'Perform a logical OR operation on an array of two or more <expressions> and select the document(s) that satisfy at least one of the <expressions>'
//   },
//   '$and': {
//     id: '$and',
//     title: '$and',
//     description: 'Performs a logical AND operation on an array of two or more <expressions> and select the document(s) that satisfy all of the <expressions>'
//   },
//   '$not': {
//     id: '$not',
//     title: '$not'
//   },
//   '$nor': {
//     id: '$nor',
//     title: '$nor'
//   }
// };

const COMPARISON_OPERATORS = {
  '$eq': {
    id: '$eq',
    title: '$eq',
    description: 'Matches values that are equal to a specified value.'
  },
  '$gt': {
    id: '$gt',
    title: '$gt',
    description: 'Matches values that are greater than a specified value.',
    defaultValue: {
      '$gt': 0
    }
  },
  '$gte': {
    id: '$gte',
    title: '$gte',
    description: 'Matches values that are greater than or equal to a specified value.',
    defaultValue: {
      '$gt': 0
    }
  },
  '$in': {
    id: '$in',
    title: '$in',
    description: 'Matches any of the values specified in an array.',
    defaultValue: {
      '$in': [123]
    }
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
    description: 'Returns geospatial objects in proximity to a point. Requires a geospatial index. The 2dsphere and 2d indexes support $near.',
    defaultValue: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [123, 123]
        },
        $maxDistance: 100,
        $minDistance: 0
      }
    }
  },
  $nearSphere: {
    id: '$nearSphere',
    title: '$nearSphere',
    description: 'Returns geospatial objects in proximity to a point on a sphere. Requires a geospatial index. The 2dsphere and 2d indexes support $nearSphere.'
  }
};

const valueTypeOptions = {
  // LOGICAL_QUERY_OPERATOR: {
  //   id: 'LOGICAL_QUERY_OPERATOR',
  //   title: 'Logical Operator',
  //   options: LOGICAL_QUERY_OPERATORS
  // },
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
    title: 'Date',
    defaultValue: 'Date(\'\')'
  },
  OBJECT: {
    id: 'OBJECT',
    title: 'Object',
    defaultValue: {
      'field': 'value'
    }
  },
  OBJECT_ID: {
    id: 'OBJECT_ID',
    title: 'Object Id',
    defaultValue: 'ObjectId(\'\')'
  },
  BINARY: {
    id: 'BINARY',
    title: 'Binary Data',
    defaultValue: 'Binary(\'\')'
  },
  // Binary, array, $type, $exists, etc.
};

class QueryValue extends Component {
  static displayName = 'QueryValue';

  static propTypes = {
    // actions:
    // label: PropTypes.string.isRequired,
    serverVersion: PropTypes.string.isRequired,
    // autoPopulated: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    onChangeQueryItemValue: PropTypes.func.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onApply: PropTypes.func,
    schemaLoaded: PropTypes.bool,
    schema: PropTypes.object,
    path: PropTypes.string,
    localAppRegistry: PropTypes.object,
    // placeholder: PropTypes.string,
    // schemaFields: PropTypes.array
    store: PropTypes.object
  };

  static defaultProps = {
    label: '',
    value: '',
    serverVersion: '3.6.0',
    autoPopulated: false,
    schemaFields: []
  };

  state = {
    expanded: false
    // queryValue: 'query value'
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

  onClickValueOption = (e, valueOption) => {
    e.preventDefault();

    if (valueOption) {
      this.setState({
        expanded: false
      });
      this.props.onChangeQueryItemValue(
        valueOption.defaultValue
          ? valueOption.defaultValue
          : valueOption.id
      );
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
          onClick={(e) => this.onClickValueOption(e, nestedValueOption)}
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
            (options ? null : valueOption)
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
        className={styles['query-value-options']}
      >
        {Object.values(valueTypeOptions).map(
          valueOption => (
            valueOption.options
              ? this.renderValueOption(valueOption)
              : this.renderNestedValueOption(valueOption)
          )
        )}
      </ul>
    );
  }

  renderValuePicker() {
    // const {
    //   queryValue
    // } = this.state;

    const {
      value,
      onChangeQueryItemValue
    } = this.props;

    if (isDate(value)) {
      return (
        <div
          className={styles['value-picker']}
        >
          <DateValue
            queryValue={value}
            onChangeQueryValue={newQueryValue => {
              onChangeQueryItemValue(newQueryValue);
            }}
          />
        </div>
      );
    }

    const {
      schema,
      store
    } = this.props;

    const fields = schema.fields;
    let type;
    let types;
    const pathDepth = this.props.path.split('.').length;
    // for (let i = 0; i < pathDepth; i++) {

    // }
    function getMatchingField(fieldName, arrayOfFields) {
      let match;
      if (arrayOfFields) {
        arrayOfFields.forEach(field => {
          // console.log('field.name === ', field.name, fieldName);
          if (field.name === fieldName) {
            // console.log('true');
            match = field;
          }
        });
      }

      return match;
    }

    let doesntMatch = false;
    this.props.path.split('.').map((interiorPath, index) => {
      // console.log('check', interiorPath);
      if (doesntMatch) {
        return;
      }

      if (index === pathDepth - 1) {
        // type = fields[];
        // if (!fields[])
        const matchingField = getMatchingField(interiorPath, fields);
        if (!matchingField) {
          doesntMatch = true;
          return;
        }

        // console.log('matches', matchingField);

        types = matchingField;
        // types = undefined;
        // type = matchingField;// .type;
        if (matchingField.types.length > 0) {
          type = matchingField.types[0];
        }

        return;
      }

      if (!doesntMatch) {
        const matchingField = getMatchingField(interiorPath, fields);
        if (!matchingField) {
          doesntMatch = true;
          return;
        }
      }
    });

    // console.log('schema at value', schema);
    // console.log('path', this.props.path);
    // const type = schema

    if (doesntMatch) {
      console.log('no type suggestion found for', this.props.path);
      // return;
    }

    console.log(this.props.path, 'type', type);


    return (
      <div
        className={styles['value-picker']}
      >
        Minichart V
        {doesntMatch && (
          <div>
            <em>
            No suggestions found.
            </em>
          </div>
        )}
        {!doesntMatch && (
          <Minichart
            fieldName={this.props.path}
            // TODO: Schema pass this type.
            type={type} // {activeType}
            nestedDocType={types} // nestedDocType
            actions={this.props.actions}
            localAppRegistry={this.props.localAppRegistry}
            store={store}
          />
        )}
      </div>
    );
  }

  renderNestedValue(id) {
    return (
      <div
        className={styles['nested-value-container']}
        key={`nested-value-${id}`}
      >
        <QueryValue
          // key={`nested-value-${id}`}
        />
      </div>
    );
  }

  renderArrayOfFields() {
    const firstId = Math.floor(Math.random() * 1000);
    const valuesToRender = [{
      id: firstId
    }, {
      id: firstId + 1
    }];

    return (
      <div
        className={styles['nested-array-value-container']}
      >
        {valuesToRender.map(id => this.renderNestedValue(id))}
      </div>
    );
  }

  renderAdditionalFields() {
    // const {
    //   value
    // } = this.props;

    // if (value === LOGICAL_QUERY_OPERATORS.$and.id
    //   || value === LOGICAL_QUERY_OPERATORS.$or.id
    //   || value === LOGICAL_QUERY_OPERATORS.$nor.id
    // ) {
    //   return this.renderArrayOfFields();
    // }

    // if (value === COMPARISON_OPERATORS.$gt.id
    //   || value === COMPARISON_OPERATORS.$lt.id
    // ) {
    //   return this.renderNestedValue(0);
    // }
  }

  render() {
    const {
      expanded
    } = this.state;

    const {
      onChangeQueryItemValue,
      value
    } = this.props;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    return (
      <Fragment>
        <div
          className={styles['query-value']}
        >
          <div className={styles['query-value-input-area']}>
            <input
              type="text"
              className={styles['query-value-input']}
              value={value}
              onChange={e => {
                onChangeQueryItemValue(e.target.value);
              }}
            />
            {expanded && this.renderExpanded()}
            {!expanded && this.renderValuePicker()}
          </div>
          <button
            className={styles['query-field-dropdown-button']}
            onClick={() => { this.setState({ expanded: !expanded }); }}
          >
            {expanded ? 'V' : '>'}
            {/* <FontAwesome fixedWidth name={symbol} /> */}
          </button>

        </div>
        {this.renderAdditionalFields()}
      </Fragment>
    );
  }
}

export default QueryValue;
