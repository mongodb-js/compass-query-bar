import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import ace from 'brace';
// import { QueryAutoCompleter } from 'mongodb-ace-autocompleter';
// import FontAwesome from 'react-fontawesome';
// import { EJSON } from 'bson';
import { isString, find, zip, min, max, filter } from 'lodash';
// import detectCoordinates from 'detect-coordinates';
import CaretDown from '@leafygreen-ui/icon/dist/CaretDown';
import ChevronRight from '@leafygreen-ui/icon/dist/ChevronRight';
import ChevronDown from '@leafygreen-ui/icon/dist/ChevronDown';
import IconButton from '@leafygreen-ui/icon-button';
// import Icon from '@leafygreen-ui/icon';
// import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import Button, {
  Size,
  Variant
} from '@leafygreen-ui/button';

import styles from './query-value.less';

import ValuePicker from '../value-picker/value-picker';

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

export const BSON_TYPES_INCOMPLETE = {
  '$oid': {
    id: '$oid',
    newTitle: 'ObjectId',
    title: 'ObjectID',
    // convert: (val) => ({
    //   $oid: `${val}`
    // }),
    defaultValue: {
      '$oid': '578f6fa2df35c7fbdbaed8e0'
    }
  },
  '$date': {
    id: '$date',
    title: 'Date',
    defaultValue: {
      '$date': new Date()
    }
  },
  '$numberDouble': {
    id: '$numberDouble',
    title: 'Double',
    defaultValue: {
      '$numberDouble': '0'
    }
  },
  '$numberLong': {
    id: '$numberLong',
    title: 'Long',
    defaultValue: {
      '$numberLong': '0'
    }
  },
  '$numberInt': {
    id: '$numberInt',
    title: 'Int 32',
    defaultValue: {
      '$numberInt': '22'
    }
  },
  '$regularExpression': {
    id: '$regularExpression',
    title: 'regex',
    defaultValue: {
      '$regularExpression': '//g'
    }
  },
  '$code': {
    id: '$code',
    title: 'Code',
    defaultValue: {
      '$code': ''
    }
  },
  '$binary': {
    id: '$binary',
    title: 'Binary Data',
    defaultValue: {
      '$binary': {
        base64: '',
        subType: '00'
      }
    }
  },
  '$timestamp': {
    id: '$timestamp',
    title: 'Timestamp',
    defaultValue: {
      '$timestamp': {
        t: 0,
        i: 1
      }
    }
  },
  '$uuid': {
    id: '$uuid',
    title: 'uuid',
    defaultValue: {
      '$uuid': ''
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
  // Object: {
  //   id: 'Object',
  //   title: 'Object',
  //   defaultValue: {
  //     '': ''
  //   }
  // },
  Document: {
    id: 'Document',
    title: 'Document',
    defaultValue: {
      '': ''
    }
  },
  Array: {
    id: 'Array',
    title: 'Array',
    defaultValue: ['']
  },
  ...BSON_TYPES_INCOMPLETE
};

// TODO: There are more of these and could probably be pulled from somewhere.
const BSON_JS_TYPE_NAMES = Object.keys(BSON_TYPES_INCOMPLETE);
// const BSON_JSON_SCHEMA_MAP = Object.value(BSON_TYPES_INCOMPLETE).map((bsonType) => bsonType.title);

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
  const possibleBsonType = Object.keys(value)[0];

  return BSON_JS_TYPE_NAMES.includes(possibleBsonType)
    || (
      Object.values(
        BSON_TYPES_INCOMPLETE
      ).filter(
        (bsonType) => bsonType.title === possibleBsonType
      ).length > 0
    );
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

function getSomeBsonKindOfType(value, fieldName) {
  let bsonTypeId;
  if (isBSONType(value)) {
    bsonTypeId = BSON_TYPES_INCOMPLETE[Object.keys(value)[0]].id;
    // getBSONTypeNameThingFromObj(value);
    // console.log('getBSONTypeNameThingFromObj', bsonTypeId);
  } else if (isObject(value) && !Array.isArray(value)) {
    // || (!isObject(value)
    bsonTypeId = allTheFieldTypes.Document.id;
  } else if (isString(fieldName) && Array.isArray(value)) {
    // || (!isObject(value)
    bsonTypeId = allTheFieldTypes.Array.id;
  } else if (isString(value)) {
    bsonTypeId = allTheFieldTypes.String.id;
  } else {
    bsonTypeId = allTheFieldTypes.Number.id;
  }

  return bsonTypeId;
  // Where is boolean
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
    store: PropTypes.object,
    darkMode: PropTypes.bool
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
      console.log('default value', valueOption.defaultValue
        ? valueOption.defaultValue
        : valueOption.id
      );
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
      console.log('allTheFieldTypes', allTheFieldTypes);
      this.setState({
        isTypePickerExpanded: false
      });
      console.log('default value22', allTheFieldTypes[newFieldTypeId].defaultValue
      );
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
                {fieldType.newTitle || fieldType.title}
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

  // renderNestedValue(id) {
  //   return (
  //     <div
  //       className={styles['nested-value-container']}
  //       key={`nested-value-${id}`}
  //     >
  //       <QueryValue
  //         // key={`nested-value-${id}`}
  //       />
  //     </div>
  //   );
  // }

  // renderArrayOfFields() {
  //   const firstId = Math.floor(Math.random() * 1000);
  //   const valuesToRender = [{
  //     id: firstId
  //   }, {
  //     id: firstId + 1
  //   }];

  //   return (
  //     <div
  //       className={styles['nested-array-value-container']}
  //     >
  //       {valuesToRender.map(id => this.renderNestedValue(id))}
  //     </div>
  //   );
  // }

  // renderAdditionalFields() {
  //   // const {
  //   //   value
  //   // } = this.props;

  //   // if (value === LOGICAL_QUERY_OPERATORS.$and.id
  //   //   || value === LOGICAL_QUERY_OPERATORS.$or.id
  //   //   || value === LOGICAL_QUERY_OPERATORS.$nor.id
  //   // ) {
  //   //   return this.renderArrayOfFields();
  //   // }

  //   // if (value === COMPARISON_OPERATORS.$gt.id
  //   //   || value === COMPARISON_OPERATORS.$lt.id
  //   // ) {
  //   //   return this.renderNestedValue(0);
  //   // }
  // }

  // eslint-disable-next-line complexity
  render() {
    const {
      expanded,
      isTypePickerExpanded,
      isValuePickerExpanded
    } = this.state;

    const {
      actions,
      path,
      fieldName,
      value,
      darkMode,
      schemaLoaded,
      localAppRegistry,
      onChangeQueryItemValue,
      schema,
      store
    } = this.props;

    // const {
    //   // bsonType,
    //   onChangeQueryItemValue,
    //   value
    // } = this.props;

    // const symbol = expanded ? 'caret-down' : 'caret-right';

    // const NUMBER = 'NUMBER';
    // let primitiveType = NUMBER;
    // if (!bsonType && isString(value)) {
    //   primitiveType = 'string';
    // }

    const isBSONValue = isBSONType(value);
    // console.log('isBSONValue', isBSONValue);
    // console.log('fieldname', fieldName);
    const bsonTypeId = getSomeBsonKindOfType(value, fieldName);

    // console.log('isValuePickerExpanded', isValuePickerExpanded);

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
            // tabIndex={0}
            // onClick={() => { this.setState({ isTypePickerExpanded: !isTypePickerExpanded }); }}
          >
            <Button
              variant={Variant.Default}
              darkMode={!!darkMode}
              onClick={() => { this.setState({ isTypePickerExpanded: !isTypePickerExpanded }); }}
              size={Size.Default}
              disabled={false}
              aria-labelledby="Type"
              // leftGlyph={<Icon glyph="leftGlyph" />}
              // rightGlyph={<Icon glyph="Caret Down" />}
              rightGlyph={<CaretDown />}
            >
              {allTheFieldTypes[bsonTypeId].newTitle || allTheFieldTypes[bsonTypeId].title}
              {/* {} */}
              {/* {!isBSONValue && (
              isString(value)
                ? 'String'
                : 'Number'
            )} */}

            </Button>
            {isTypePickerExpanded && this.renderTypePicker()}
          </div>
          {!(
            allTheFieldTypes[bsonTypeId].id === allTheFieldTypes.Document.id
            || allTheFieldTypes[bsonTypeId].id === allTheFieldTypes.Array.id
          ) && (
            <div
              className={styles['query-value-input-area']}
              ref={this.valuePickerRef}
            >
              <TextInput
                type="text"
                className={styles['query-value-input']}
                value={isBSONValue ? `${value[bsonTypeId]}` : `${value}`}
                // onChange={e => {
                //   onRenameQueryItem(value, e.target.value);
                // }}
                aria-labelledby="Value"
                darkMode={!!darkMode}
                onFocus={() => {
                  console.log('on focus');
                  this.setState({ isValuePickerExpanded: true });
                }}
                // onClick={() => {
                //   this.setState({ isValuePickerExpanded: true });
                // }}
                onChange={e => {
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
              {/* <input
                type="text"
                className={styles['query-value-input']}
                value={isBSONValue ? value[bsonTypeId] : value}
                onFocus={() => {
                // console.log('on focus');
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
              /> */}

              {!expanded && !isTypePickerExpanded && isValuePickerExpanded && (
                <div
                  className={styles['query-value-picker-container']}
                >
                  <ValuePicker
                    // expanded={isValuePickerExpanded}
                    expanded
                    actions={actions}
                    path={path}
                    // expanded={expanded}
                    fieldName={fieldName}
                    value={value}
                    schemaLoaded={schemaLoaded}
                    localAppRegistry={localAppRegistry}
                    onChangeQueryItemValue={onChangeQueryItemValue}
                    schema={schema}
                    store={store}
                  />
                </div>
              )}
            </div>
          )}

          <div className={styles['query-field-options-area']}>
            {/* <button
              className={styles['query-field-dropdown-button']}
            > */}
            <IconButton
              // className={}
              darkMode={!!darkMode}
              aria-labelledby={expanded ? 'Close Options' : 'Open Options'}
              onClick={() => { this.setState({ expanded: !expanded }); }}
            >

              {expanded ? <ChevronDown /> : <ChevronRight />}

            </IconButton>
            {expanded && this.renderExpanded()}

            {/* {expanded ? 'V' : '>'} */}
            {/* <FontAwesome fixedWidth name={symbol} /> */}
            {/* </button> */}

          </div>


        </div>
        {/* {this.renderAdditionalFields()} */}
      </Fragment>
    );
  }
}

export default QueryValue;
