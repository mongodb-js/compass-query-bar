import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Autocomplete from 'react-autocomplete';

import styles from './query-field.less';

const LOGICAL_QUERY_OPERATORS = {
  '$or': {
    id: '$or',
    title: '$or',
    description: 'Perform a logical OR operation on an array of two or more <expressions> and select the document(s) that satisfy at least one of the <expressions>',
    defaultValue: [{
      firstCondition: true
    }, {
      secondCondition: true
    }]
  },
  '$and': {
    id: '$and',
    title: '$and',
    description: 'Performs a logical AND operation on an array of two or more <expressions> and select the document(s) that satisfy all of the <expressions>',
    defaultValue: [{
      firstCondition: true
    }, {
      secondCondition: true
    }]
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
  }
};


class QueryField extends Component {
  static displayName = 'QueryField';

  static propTypes = {
    onRenameQueryItem: PropTypes.func.isRequired,
    renameAndUpdateValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    schemaFields: PropTypes.array,
    schemaLoaded: PropTypes.bool,
    schema: PropTypes.object,
    path: PropTypes.string.isRequired
    // field: PropTypes.string.isRequired
  };

  state = {
    expanded: false,
    queryValue: 'query field'
  };

  constructor(props) {
    super(props);

    this.queryValueOptionsRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.state.expanded
      && this.queryValueOptionsRef
      && this.queryValueOptionsRef.current
      && !this.queryValueOptionsRef.current.contains(event.target)
    ) {
      this.setState({
        expanded: false
      });
    }
  }

  onClickValueOption = (e, valueOption) => {
    e.preventDefault();

    if (valueOption) {
      this.setState({
        expanded: false
      });

      if (valueOption.defaultValue) {
        this.props.renameAndUpdateValue(
          this.props.value,
          valueOption.id,
          valueOption.defaultValue
        );
      } else {
        this.props.onRenameQueryItem(
          this.props.value,
          valueOption.id
        );
      }
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
        ref={this.queryValueOptionsRef}
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

  renderAutoComplete() {
    // const {
    //   queryValue
    // } = this.state;

    const {
      onRenameQueryItem,
      schema,
      path,
      value
    } = this.props;

    const pathDepth = this.props.path.split('.').length;
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

    let autocompleteOptions;
    let doesntMatch = false;


    const fields = schema.fields;
    path.split('.').map((interiorPath, index) => {
      // console.log('check', interiorPath);
      if (doesntMatch) {
        return;
      }

      if (index === pathDepth - 1) {
        // type = fields[];
        // if (!fields[])
        // const matchingField = getMatchingField(interiorPath, fields);
        // if (!matchingField) {
        //   doesntMatch = true;
        //   return;
        // }

        if (fields) {
          autocompleteOptions = fields.filter(schemaField => (
            !value
            || (
              schemaField.name.toLowerCase().includes(value.toLowerCase())
              && schemaField.name !== value
            )
          ));
        }

        return;
      }

      if (!doesntMatch) {
        const matchingField = getMatchingField(interiorPath, fields);
        if (!matchingField) {
          doesntMatch = true;
          return;
        }

        // TODO: Nested fields.
        // fields =
      }
    });

    // const autocompleteOptions = schemaFields.filter(schemaField => (
    //   !value
    //   || (
    //     schemaField.value.toLowerCase().includes(value.toLowerCase())
    //     && schemaField.value !== value
    //   )
    // ));

    if (!autocompleteOptions || autocompleteOptions.length === 0) {
      return;
    }
    // console.log('schemaFields', schemaFields);

    return (
      <ul
        className={styles.autocomplete}
      >
        {autocompleteOptions.map(option => (
          <li
            className={styles['autocomplete-option']}
            key={`${option.name}`}
          >
            <a
              href="#"
              // onClick={() => console.log('clicked')}
              onChange={() => {
                onRenameQueryItem(value, option.name);
              }}
              onClick={() => {
                onRenameQueryItem(value, option.name);
              }}
              onSelect={() => {
                onRenameQueryItem(value, option.name);
              }}
              tabIndex={0}
            >
              {option.name}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const {
      expanded
    } = this.state;

    const {
      onRenameQueryItem,
      // schemaFields,
      value
    } = this.props;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    // console.log('schema fields', schemaFields);
    // debug('schema fields', schemaFields);

    return (
      <div
        className={styles['query-field']}
      >

        <div className={styles['query-field-input-area']}>
          {/* <Autocomplete
            className={styles['query-field-input']}
            getItemValue={(item) => item.value}
            items={schemaFields}
            renderItem={(item, isHighlighted) =>
              (<div
                style={{
                  zIndex: 1000000,
                  background: isHighlighted
                    ? 'lightgray'
                    : 'white'
                }}
              >
                {item.name}
              </div>)
            }
            value={value}
            onChange={(e) => {
              onRenameQueryItem(value, e.target.value);
            }}
            onSelect={(val) => {
              onRenameQueryItem(value, val);
            }}
            // menuStyle={{
            //   zIndex: 100000,
            //   borderRadius: '3px',
            //   boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            //   background: 'rgba(255, 255, 255, 0.9)',
            //   padding: '2px 0',
            //   fontSize: '90%',
            //   position: 'absolute',
            //   top: '90%',
            //   left: 0,
            //   // overflow: 'scro',
            //   maxHeight: '50%',
            //   // height: 'auto'
            // }}
          /> */}
          <input
            type="text"
            className={styles['query-field-input']}
            value={value}
            onChange={e => {
              onRenameQueryItem(value, e.target.value);
            }}
          />
          {expanded && this.renderExpanded()}
          {!expanded && this.renderAutoComplete()}
        </div>
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
