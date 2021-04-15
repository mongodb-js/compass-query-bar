import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';
// import FontAwesome from 'react-fontawesome';
// import { EJSON } from 'bson';
import { find } from 'lodash';

// import 'brace/ext/language_tools';
// import 'mongodb-ace-mode';
// import 'mongodb-ace-theme-query';

import styles from './query-value.less';
import DateValue from './date-value/date-value';
import Minichart from '../../schema/minichart';
import { isString } from 'lodash';

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
    description: 'Matches values that are equal to a specified value.',
    defaultValue: {
      '$eq': 0
    }
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
    description: 'Matches values that are less than a specified value.',
    defaultValue: {
      '$lt': 100
    }
  },
  '$lte': {
    id: '$lte',
    title: '$lte',
    description: 'Matches values that are less than or equal to a specified value.',
    defaultValue: {
      '$lte': 100
    }
  },
  '$ne': {
    id: '$ne',
    title: '$ne',
    description: 'Matches all values that are not equal to a specified value.',
    defaultValue: {
      '$ne': ''
    }
  },
  '$nin': {
    id: '$nin',
    title: '$nin',
    description: 'Matches none of the values specified in an array.',
    defaultValue: {
      '$nin': [123]
    }
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
  // DATE_TYPE: {
  //   id: 'DATE_TYPE',
  //   title: 'Date',
  //   defaultValue: {
  //     $date: ''
  //   }// 'Date(\'\')'
  // },
  // OBJECT: {
  //   id: 'OBJECT',
  //   title: 'Object',
  //   defaultValue: {
  //     '': ''
  //   }
  // },
  // OBJECT_ID: {
  //   id: 'OBJECT_ID',
  //   title: 'Object Id',
  //   defaultValue: {
  //     $oid: ''
  //   }
  //   // }'ObjectId(\'\')'
  // },
  // BINARY: {
  //   id: 'BINARY',
  //   title: 'Binary',
  //   defaultValue: {
  //     $binary: {
  //       base64: '',
  //       subType: '00'
  //     }
  //   }
  //   // defaultValue: 'Binary(\'\')'
  // },
  // Binary, array, $type, $exists, etc.
};

const BSON_THINGS = {
  '$oid': {
    id: '$oid',
    title: 'ObjectId',
    // convert: (val) => ({
    //   $oid: `${val}`
    // }),
    defaultValue: {
      $oid: '578f6fa2df35c7fbdbaed8e0'
    }
  },
  '$date': {
    id: '$date',
    title: 'Date',
    defaultValue: {
      $date: new Date()
    }
  },
  '$numberDouble': {
    id: '$numberDouble',
    title: 'Double',
    defaultValue: {
      $numberDouble: '0'
    }
  },
  '$numberLong': {
    id: '$numberLong',
    title: 'Long',
    defaultValue: {
      $numberLong: '0'
    }
  },
  '$numberInt': {
    id: '$numberInt',
    title: 'Int 32',
    defaultValue: {
      $numberInt: '22'
    }
  },
  '$regularExpression': {
    id: '$regularExpression',
    title: 'regex',
    defaultValue: {
      $regex: '//g'
    }
  },
  '$code': {
    id: '$code',
    title: 'Code',
    defaultValue: {
      $code: ''
    }
  },
  '$binary': {
    id: '$binary',
    title: 'Binary Data',
    defaultValue: {
      $binary: {
        base64: '',
        subType: '00'
      }
    }
  },
  '$timestamp': {
    id: '$timestamp',
    title: 'Timestamp',
    defaultValue: {
      t: 0,
      i: 1
    }
  },
  '$uuid': {
    id: '$uuid',
    title: 'uuid',
    defaultValue: {
      $uuid: ''
    }
  },
};

const allTheFieldTypes = {
  String: {
    id: 'String',
    title: 'String',
    defaultValue: ''
  },
  Number: {
    id: 'Number',
    title: 'Number',
    defaultValue: 0
  },
  Object: {
    id: 'Object',
    title: 'Object',
    defaultValue: {
      '': ''
    }
  },
  Array: {
    id: 'Array',
    title: 'Array',
    defaultValue: ['']
  },
  ...BSON_THINGS
};

// TODO: There are more of these and could probably be pulled from somewhere.
const BSON_JS_TYPE_NAMES = Object.keys(BSON_THINGS);
// [
//   '$oid',
//   '$date',
//   '$numberDouble',
//   '$numberLong',
//   '$numberInt',
//   '$regularExpression',
//   '$code',
//   '$binary',
//   '$timestamp',
//   '$uuid'
// ];

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

export function isBSONType(value) {
  if (!isObject(value)) {
    return false;
  }

  if (Object.keys(value).length !== 1) {
    return false;
  }
  const bsonType = Object.keys(value)[0];

  return BSON_JS_TYPE_NAMES.includes(bsonType);
}

export function getBSONTypeNameThingFromObj(value) {
  const bsonType = Object.keys(value)[0];
  return BSON_JS_TYPE_NAMES.filter(typeName => typeName === bsonType)[0];
}

function getNestedDocType(types) {
  if (!types) {
    return null;
  }

  // check for directly nested document first
  const docType = find(types, { name: 'Document' });
  if (docType) {
    return docType;
  }
  // otherwise check for nested documents inside an array
  const arrType = find(types, { name: 'Array' });
  if (arrType) {
    return find(arrType.types, { name: 'Document' });
  }
  return null;
}

class QueryValue extends Component {
  static displayName = 'QueryValue';

  static propTypes = {
    // actions:
    // label: PropTypes.string.isRequired,
    bsonType: PropTypes.string,
    serverVersion: PropTypes.string.isRequired,
    // autoPopulated: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
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
    expanded: false,
    isTypePickerExpanded: false,
    isValuePickerExpanded: false
    // queryValue: 'query value'
  };

  // queryValueOptionsRef = null;

  /**
   * Set up the autocompleters once on initialization.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);

    this.queryValueOptionsRef = React.createRef();
    this.valueTypeOptionsRef = React.createRef();
    this.valuePickerRef = React.createRef();

    // const textCompleter = tools.textCompleter;
    // this.completer = new QueryAutoCompleter(props.serverVersion, textCompleter, props.schemaFields);
    // this.boundOnFieldsChanged = this.onFieldsChanged.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  // eslint-disable-next-line complexity
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

    if (
      this.state.isTypePickerExpanded
      && this.valueTypeOptionsRef
      && this.valueTypeOptionsRef.current
      && !this.valueTypeOptionsRef.current.contains(event.target)
    ) {
      this.setState({
        isTypePickerExpanded: false
      });
    }

    if (
      this.state.isValuePickerExpanded
      && this.valuePickerRef
      && this.valuePickerRef.current
      && !this.valuePickerRef.current.contains(event.target)
    ) {
      this.setState({
        isValuePickerExpanded: false
      });
    }
  }

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

  onClickChangeFieldType = (e, newFieldTypeId) => {
    e.preventDefault();

    console.log('set field type to', newFieldTypeId);

    if (newFieldTypeId) {
      this.setState({
        isTypePickerExpanded: false
      });
      this.props.onChangeQueryItemValue(
        allTheFieldTypes[newFieldTypeId].defaultValue
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

  renderTypePicker() {
    return (
      <ul
        className={styles['query-value-options']}
        ref={this.valueTypeOptionsRef}
      >
        {Object.values(allTheFieldTypes).map(
          fieldType => (
            <li
              className={styles['query-value-option']}
              key={fieldType.id}
            >
              <a
                className={styles['query-value-option-link']}
                href="#"
                onClick={(e) => this.onClickChangeFieldType(
                  e,
                  fieldType.id
                )}
              >
                {fieldType.title}
              </a>
            </li>
          )
        )}
      </ul>
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

  renderValuePicker() {
    const {
      isValuePickerExpanded
    } = this.state;

    const {
      path,
      fieldName,
      value,
      schemaLoaded,
      onChangeQueryItemValue
    } = this.props;

    if (!fieldName || !schemaLoaded) {
      return;
    }


    if (isBSONType(value) && getBSONTypeNameThingFromObj(value) === '$date') {
      return (
        <div
          className={`${styles['value-picker']} ${isValuePickerExpanded ? styles['show-value-picker'] : ''}`}
        >
          <DateValue
            queryValue={value.$date}
            onChangeQueryValue={newQueryValue => {
              onChangeQueryItemValue({
                $date: newQueryValue
              });
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
    function getMatchingField(fieldNameToMatch, arrayOfFields) {
      let match;
      if (arrayOfFields) {
        arrayOfFields.forEach(field => {
          // console.log('field.name === ', field.name, fieldName);
          if (field.name === fieldNameToMatch) {
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

        types = matchingField.types;
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
        // TODO: Nested fields.
        // fields =
      }
    });

    // console.log('schema at value', schema);
    // console.log('path', this.props.path);
    // const type = schema

    if (doesntMatch) {
      console.log('no type suggestion found for', this.props.path);
      return;
    }

    // console.log(this.props.path, 'type', type);


    console.log('render for path value', path, value);

    return (
      <div
        className={`${styles['value-picker']} ${isValuePickerExpanded ? styles['show-value-picker'] : ''}`}
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
            nestedDocType={getNestedDocType(types)} // nestedDocType
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
      expanded,
      isTypePickerExpanded
    } = this.state;

    const {
      // bsonType,
      onChangeQueryItemValue,
      value
    } = this.props;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    // const NUMBER = 'NUMBER';
    // let primitiveType = NUMBER;
    // if (!bsonType && isString(value)) {
    //   primitiveType = 'string';
    // }

    const isBSONValue = isBSONType(value);
    // console.log('isBSONValue', isBSONValue);
    let bsonTypeId;
    if (isBSONValue) {
      bsonTypeId = getBSONTypeNameThingFromObj(value);
      // console.log('getBSONTypeNameThingFromObj', bsonTypeId);
    }

    // console.log('value', value);
    // console.log('bsonTypeId', bsonTypeId);
    // console.log('value[bsonTypeId]', value[bsonTypeId]);

    return (
      <Fragment>
        <div
          className={styles['query-value']}
        >
          <div
            className={styles['query-value-type']}
            tabIndex={0}
            onClick={() => { this.setState({ isTypePickerExpanded: !isTypePickerExpanded }); }}
          >
            {isBSONValue && BSON_THINGS[bsonTypeId].title}
            {!isBSONValue && (
              isString(value)
                ? 'String'
                : 'Number'
            )}
            {isTypePickerExpanded && this.renderTypePicker()}
          </div>
          <div
            className={styles['query-value-input-area']}
            ref={this.valuePickerRef}
          >
            <input
              type="text"
              className={styles['query-value-input']}
              value={isBSONValue ? value[bsonTypeId] : value}
              onFocus={() => {
                console.log('on focus');
                this.setState({ isValuePickerExpanded: true });
              }}
              onChange={e => {
                // console.log('!!!!1 w/', {
                //   _bsonType: bsonType,
                //   value: e.target.value
                // });
                // if (bsonType) {
                // const newValue = {
                //   $oid: e.target.value
                //   // _bsonType: bsonType,
                //   // value: e.target.value
                // };

                if (isBSONValue) {
                  onChangeQueryItemValue({
                    [bsonTypeId]: e.target.value
                  });
                  return;
                }

                if (isString(value)) {
                  onChangeQueryItemValue(e.target.value);
                  return;
                }

                onChangeQueryItemValue(Number(e.target.value));
              }}
            />

            {!expanded && !isTypePickerExpanded && this.renderValuePicker()}
          </div>

          <div className={styles['query-field-options-area']}>
            <button
              className={styles['query-field-dropdown-button']}
              onClick={() => { this.setState({ expanded: !expanded }); }}
            // tabIndex="0"
            // onBlur={() => { this.setState({ expanded: false }); } }
            >
              {expanded ? 'V' : '>'}
              {/* <FontAwesome fixedWidth name={symbol} /> */}
            </button>

            {expanded && this.renderExpanded()}
          </div>


        </div>
        {this.renderAdditionalFields()}
      </Fragment>
    );
  }
}

export default QueryValue;
