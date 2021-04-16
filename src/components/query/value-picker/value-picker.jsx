import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isString, find, zip, min, max, filter } from 'lodash';
// import {
//   Date
// } from 'bson';

// import styles from './query-value.less';
import DateValue from './date-value/date-value';
import Minichart from '../../schema/minichart';

import styles from './value-picker.less';

/**
 * extract longitudes and latitudes, run a bounds check and return zipped
 * coordinates or false, if the bounds check fails. Bounds are [-180, 180] for
 * longitude, [-90, 90] for latitude, boundaries included.
 *
 * @api private
 *
 * @param  {Array} values  a flattened array of coordinates: [lng, lat, lng, lat, ...]
 * @return {[type]}        returns a zipped array of [[lng, lat], [lng, lat], ...]
 *                         coordinates or false if bounds check fails.
 */
function _zipCoordinates(values) {
  const lons = filter(values, function(val, idx) {
    return idx % 2 === 0;
  });
  const lats = filter(values, function(val, idx) {
    return idx % 2 === 1;
  });
  // if (min(lons) >= -180 && max(lons) <= 180 &&
  //   min(lats) >= -90 && max(lats) <= 90) {
  return zip(lons, lats);
  // }
  // return false;
}

const aaaaaa = false;

function getSemanticType(type) {
  // check if the type represents geo coordinates, if privacy settings allow
  if (!aaaaaa || (global.hadronApp.isFeatureEnabled('enableMaps') && process.env.HADRON_ISOLATED !== 'true')) {
    // const coords = detectCoordinates(type);
    // console.log('type', type);
    // console.log('is coords?', coords); coords ||
    // TODO: Get rid of path check and look for geo json.
    if ((type.name === 'Array' && (type.path === 'location' || type.path === 'coordinates' || type.path === 'koordinaten'))) {
      // console.log('new values', _zipCoordinates(type.types[0].values));
      return {
        ...type,
        name: 'Coordinates',
        values: _zipCoordinates(type.types[0].values)
      };
      // type.name = 'Coordinates';
      // type.values = coords;
    }
  }
  return type;
}

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
    defaultValue: new Date()
    // {
    //   '$date': new Date()
    // }
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

export function getSomeBsonKindOfType(value) {
  let bsonTypeId;
  if (isBSONType(value)) {
    bsonTypeId = BSON_TYPES_INCOMPLETE[Object.keys(value)[0]].id;
    // getBSONTypeNameThingFromObj(value);
    // console.log('getBSONTypeNameThingFromObj', bsonTypeId);
  } else if (isObject(value) && !Array.isArray(value)) {
    // || (!isObject(value)
    bsonTypeId = allTheFieldTypes.Document.id;
  } else if (Array.isArray(value)) {
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

class ValuePicker extends Component {
  static displayName = 'ValuePicker';

  static propTypes = {
    // onChangeQueryValue: PropTypes.func.isRequired,
    // queryValue: PropTypes.string.isRequired,

    // label: PropTypes.string.isRequired,
    // bsonType: PropTypes.string,
    // serverVersion: PropTypes.string.isRequired,
    // autoPopulated: PropTypes.bool.isRequired,
    expanded: PropTypes.bool,

    // expanded,
    // fieldName,
    // value,
    // schemaLoaded,
    // onChangeQueryItemValue

    actions: PropTypes.object,
    fieldName: PropTypes.string.isRequired,
    onChangeQueryItemValue: PropTypes.func.isRequired,
    value: PropTypes.any,
    schemaLoaded: PropTypes.bool,
    schema: PropTypes.object,
    path: PropTypes.string,
    localAppRegistry: PropTypes.object,
    // placeholder: PropTypes.string,
    // schemaFields: PropTypes.array
    store: PropTypes.object,
    darkMode: PropTypes.bool
  };

  render() {
    const {
      actions,
      path,
      expanded,
      fieldName,
      value,
      schemaLoaded,
      localAppRegistry,
      onChangeQueryItemValue,
      schema,
      store
    } = this.props;

    // console.log('try to render value pickers', fieldName, schemaLoaded);

    if (!fieldName || !schemaLoaded) {
      return null;
    }

    // console.log('render?');
    // console.log('expanded', expanded);
    // console.log('path', path);
    // console.log('value picker for type', getBSONTypeNameThingFromObj(value));

    if (isBSONType(value) && getBSONTypeNameThingFromObj(value) === allTheFieldTypes.$date.id) {
      return (
        <div
          className={`${styles['value-picker']} ${!expanded ? styles['show-value-picker'] : ''}`}
        >
          <DateValue
            queryValue={value.$date}
            onChangeQueryValue={onChangeQueryItemValue}
          />
        </div>
      );
    }

    const fields = schema.fields;
    console.log('match fields w ', fields);
    console.log('match with', path);
    let type;
    let types;
    const pathDepth = path.split('.').length;
    function getMatchingField(fieldNameToMatch, arrayOfFields) {
      let match;
      if (arrayOfFields) {
        arrayOfFields.forEach(field => {
          if (field.name === fieldNameToMatch) {
            match = field;
          } else if (field.title === fieldNameToMatch) {
            match = field;
          } else if (field.path === fieldNameToMatch) {
            match = field;
          }
        });
      }

      console.log('try match', fieldNameToMatch, arrayOfFields);
      console.log('was there match', match);

      return match;
    }

    let doesntMatch = false;
    path.split('.').map((interiorPath, index) => {
      if (doesntMatch) {
        return;
      }

      // console.log('1', doesntMatch);
      // console.log('interiorPath', interiorPath);


      if (index === pathDepth - 1) {
        const matchingField = getMatchingField(interiorPath, fields);
        console.log('got matchingField', matchingField);
        if (!matchingField) {
          doesntMatch = true;
          return;
        }


        if (matchingField.types.length > 0) {
          types = matchingField.types;
          // type = matchingField.types;
          const activeType = getSomeBsonKindOfType(value);
          matchingField.types.forEach((matchingFieldType) => {
            // console.log('is matchingFieldType', matchingFieldType, activeType);
            // console.log('matching?', matchingFieldType.name, BSON_TYPES_INCOMPLETE[activeType]);
            // console.log('activeType', getSemanticType(activeType), matchingFieldType);
            if (matchingFieldType.name === activeType
              || (
                BSON_TYPES_INCOMPLETE[activeType]
                && matchingFieldType.name === BSON_TYPES_INCOMPLETE[activeType].title
              )
              || (
                path.split('.').slice(-1)[0] === 'location'
                || path.split('.').slice(-1)[0] === 'koordinaten'
                || path.split('.').slice(-1)[0] === 'coordinates'
              )
            ) {
              // type = ;
              // console.log('did match', matchingField);
              type = getSemanticType(matchingFieldType);
            }
          });
          // console.log('getSemanticType', type);
        }

        if (!type) {
          doesntMatch = true;
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

    if (doesntMatch) {
      console.log('no type suggestion found for', path);
      return null;
    }
    // console.log('do render aaaaaaaaa', path);

    return (
      <div
        className={`${styles['value-picker']} ${expanded ? styles['show-value-picker'] : ''}`}
      >
        {doesntMatch && (
          <div
            className={styles['empty-value-picker']}
          >
            <em>
              No suggestions found.
            </em>
          </div>
        )}
        {!doesntMatch && (
          <div
            className={`${
              styles['value-picker-chart']
            } ${
              type.name === 'Coordinates' ? styles['value-picker-chart-map'] : ''
            }`}
          >
            <Minichart
              fieldName={path}
              // TODO: Schema pass this type.
              type={type} // {activeType}
              nestedDocType={getNestedDocType(types)} // nestedDocType
              actions={actions}
              localAppRegistry={localAppRegistry}
              store={store}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ValuePicker;
