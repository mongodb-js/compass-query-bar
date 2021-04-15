import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import styles from './query-item.less';

// import BSON_TYPES from '../../../constants/schema';
import QueryValue, {
  // getBSONTypeNameThingFromObj,
  isBSONType
} from '../query-value/query-value';
import QueryField from '../query-field/query-field';

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

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

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

class QueryItem extends Component {
  static displayName = 'QueryItem';

  static propTypes = {
    actions: PropTypes.object.isRequired,
    // bsonType: PropTypes.string,
    localAppRegistry: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    onRemoveQueryItem: PropTypes.func.isRequired,
    onChangeQueryItemValue: PropTypes.func.isRequired,
    onAddQueryItem: PropTypes.func.isRequired,
    onRenameQueryItem: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    renameAndUpdateValue: PropTypes.func.isRequired,
    schema: PropTypes.object,
    schemaLoaded: PropTypes.bool,
    schemaFields: PropTypes.array,
    value: PropTypes.any.isRequired,
    store: PropTypes.object,
  }

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

  onChangeArrayQueryItemValue = (arrayIndex, updatePath, newValue) => {
    const valueUpdate = [
      ...this.props.value
    ];

    valueUpdate[arrayIndex] = {
      ...valueUpdate[arrayIndex],
      [updatePath]: newValue
    };

    this.props.onChangeQueryItemValue(this.props.field, valueUpdate);
  }

  onChangeQueryItemValue = (index, newValue) => {
    // TODO: Maybe this is some reference destruction.
    // Maybe we do different for objects/arrays.
    const newValues = {
      ...this.props.value,
      [index]: newValue
    };
    console.log('index', index, 'new value', newValue);
    console.log('newValues', newValues);

    this.props.onChangeQueryItemValue(this.props.field, newValues);
  }

  arrayRenameAndUpdateValue = (arrayIndex, currentIndex, newIndex, newValue) => {
    // TODO: Maybe this is some reference destruction.
    // Maybe we do different for objects/arrays.
    const newValues = replaceKeyInSameSpot(
      this.props.value[arrayIndex],
      currentIndex,
      newIndex,
      newValue
    );

    const newArrayValue = [
      ...this.props.value
    ];

    newArrayValue[arrayIndex] = newValues;

    this.props.onChangeQueryItemValue(this.props.field, newArrayValue);
  }

  renameAndUpdateValue = (currentIndex, newIndex, newValue) => {
    // TODO: Maybe this is some reference destruction.
    // Maybe we do different for objects/arrays.
    const newValues = replaceKeyInSameSpot(
      this.props.value,
      currentIndex,
      newIndex,
      newValue
    );

    this.props.onChangeQueryItemValue(this.props.field, newValues);
  }

  // onRenameQueryItem = (previousIndex, newIndex) => {

  //   this.props.onChangeQueryItemValue(this.props.path, {
  //     ...this.props.field,
  //     [index: queryItem
  //   });
  // }

  onRenameQueryItem = (currentIndex, newIndex) => {
    // TODO: Maybe this is some reference destruction.
    // Maybe we do different for objects/arrays.
    const newValues = replaceKeyInSameSpot(
      this.props.value,
      currentIndex,
      newIndex,
      this.props.value[currentIndex]
    );

    this.props.onChangeQueryItemValue(this.props.field, newValues);
  }

  onRenameArrayQueryItem = (arrayIndex, currentIndex, newIndex) => {
    // TODO: Maybe this is some reference destruction.
    // Maybe we do different for objects/arrays.
    const newArrayValue = replaceKeyInSameSpot(
      this.props.value[arrayIndex],
      currentIndex,
      newIndex,
      this.props.value[arrayIndex][currentIndex]
    );

    const newValue = [
      ...this.props.value
    ];

    newValue[arrayIndex] = newArrayValue;

    this.props.onChangeQueryItemValue(this.props.field, newValue);
  }

  onRemoveArrayQueryItem = (arrayIndex, index) => {
    const newValue = [
      ...this.props.value
    ];

    delete newValue[arrayIndex][index];

    if (Object.keys(newValue[arrayIndex]) < 1) {
      // Delete array index since empty array.
      newValue.splice(arrayIndex, 1);
      this.props.onChangeQueryItemValue(this.props.field, newValue);
      return;
    }

    this.props.onChangeQueryItemValue(this.props.field, newValue);
  }

  onRemoveQueryItem = (index) => {
    if (Array.isArray(this.props.value)) {
      const newValue = [
        ...this.props.value
      ];
      newValue.splice(index, 1);
      this.props.onChangeQueryItemValue(this.props.field, newValue);

      return;
    }

    const newValue = {
      ...this.props.value
    };

    delete newValue[index];

    this.props.onChangeQueryItemValue(this.props.field, newValue);
  }

  onAddArrayQueryItem = (arrayIndex) => {
    const newValue = [
      ...this.props.value
    ];

    let newFieldName = '';
    if (newValue[arrayIndex][newFieldName]) {
      let counter = 1;
      while (!!newValue[arrayIndex][`field ${counter}`]) {
        counter++;
      }
      newFieldName = `field ${counter}`;
    }

    newValue[arrayIndex] = {
      ...newValue[arrayIndex],
      [newFieldName]: ''
    };
    this.props.onChangeQueryItemValue(this.props.field, newValue);
  }

  onAddQueryItem = () => {
    if (Array.isArray(this.props.value)) {
      const newValue = [
        ...this.props.value,
        {
          '': ''
        }
      ];
      this.props.onChangeQueryItemValue(this.props.field, newValue);

      return;
    }

    let newFieldName = '';
    if (this.props.value[newFieldName]) {
      let counter = 1;
      while (!!this.props.value[`field ${counter}`]) {
        counter++;
      }
      newFieldName = `field ${counter}`;
    }

    const newValue = {
      ...this.props.value,
      [newFieldName]: ''
    };

    this.props.onChangeQueryItemValue(this.props.field, newValue);
  }

  renderArrayItem = (expression, arrayIndex) => {
    const {
      actions,
      // bsonType,
      localAppRegistry,
      field,
      path,
      schemaFields,
      schema,
      schemaLoaded,
      store,
      value
    } = this.props;

    const isBSONValue = isBSONType(value);
    // if () {

    // }

    return (
      <div
        className={styles['query-array-item']}
        key={`${path}-${arrayIndex}`}
      >
        {/* TODO: The coordinates override here. isBSONValue && */}
        {(
          <QueryValue
            // TODO: Path using path.
            actions={actions}
            localAppRegistry={localAppRegistry}
            path={`${field}.${arrayIndex}`}
            onChangeQueryItemValue={(fieldToUpdate, newValue) => this.onChangeArrayQueryItemValue(arrayIndex, fieldToUpdate, newValue)}
            value={value}
            // originalValue={originalValue}
            schemaFields={schemaFields}
            schema={schema}
            fieldName={field}
            schemaLoaded={schemaLoaded}
            store={store}
            // bsonType={bsonType}
          />
        )}
        {!isBSONValue && isObject(expression) && Object.entries(expression).map(
          ([nestedField, nestedValue], nestedIndex) => (
            <QueryItem
              actions={actions}
              localAppRegistry={localAppRegistry}
              // key={`${field}-${index}`}
              path={`${field}.${arrayIndex}.${nestedField}`}
              field={nestedField}
              value={nestedValue}
              key={`${path}-${arrayIndex}-${nestedIndex}`}
              // queryItem={query}
              schema={schema}
              schemaLoaded={schemaLoaded}
              onChangeQueryItemValue={(fieldToUpdate, newValue) => this.onChangeArrayQueryItemValue(arrayIndex, fieldToUpdate, newValue)}
              onRemoveQueryItem={(fieldNameToDel) => this.onRemoveArrayQueryItem(arrayIndex, fieldNameToDel)}
              onRenameQueryItem={(currentField, newField) => this.onRenameArrayQueryItem(arrayIndex, currentField, newField)}
              onAddQueryItem={() => this.onAddArrayQueryItem(arrayIndex)}
              renameAndUpdateValue={(currentIndex, newIndex, newVal) => this.arrayRenameAndUpdateValue(arrayIndex, currentIndex, newIndex, newVal)}
              schemaFields={schemaFields}
              store={store}
            />
          )
        )}
      </div>
    );
  }


  renderArray() {
    const {
      value
    } = this.props;

    return (
      <Fragment>
        [&nbsp;{value.length > 0 && value[0] && !isBSONType(value[0]) && isObject(value[0]) && (
          <Fragment>
            &#123;
          </Fragment>
        )}
        <div
          className={styles['query-array']}
        >
          {value.map(
            (expression, arrayIndex) => this.renderArrayItem(expression, arrayIndex)
          )}
        </div>
        &#125;&nbsp;
        <button
          onClick={() => this.onAddQueryItem()}
        >
          +
        </button>
        &nbsp;
        ]
      </Fragment>
    );
  }

  render() {
    const {
      actions,
      // bsonType,
      localAppRegistry,
      field,
      onRemoveQueryItem,
      onChangeQueryItemValue,
      onAddQueryItem,
      onRenameQueryItem,
      renameAndUpdateValue,
      path,
      schemaFields,
      schema,
      schemaLoaded,
      store,
      value
    } = this.props;

    // console.log('bsonType', bsonType);
    // console.log('value', value);
    // if (value) {
    //   console.log('Objectkeys', Object.keys(value));
    //   console.log('Objectvals', Object.values(value));
    // }

    const isBSONValue = isBSONType(value);
    // console.log('isBSONValue', isBSONValue);
    // if (isBSONValue) {
    //   console.log('getBSONTypeNameThingFromObj', getBSONTypeNameThingFromObj(value));
    // }
    // if (isBSONType(value)) {

    // }

    return (
      <div>
        <div
          className={styles['query-item-actions-container']}
        >
          <button
            onClick={() => onRemoveQueryItem(field)}
          >
            x
          </button>
          <button
            onClick={() => onAddQueryItem()}
          >
            +
          </button>
        </div>
        <div
          className={styles['query-item-container']}
        >
          <div
            style={{
              verticalAlign: 'top',
              display: 'inline-block'
            }}
          >

            <QueryField
              value={field}
              schema={schema}
              schemaLoaded={schemaLoaded}
              // onAddQueryItem={onAddQueryItem}
              renameAndUpdateValue={renameAndUpdateValue}
              // onChangeQueryItemValue={this.onChangeQueryItemValue}
              onRenameQueryItem={onRenameQueryItem}
              schemaFields={schemaFields}
              path={path}
              store={store}
            />
            <span
            >
            :&nbsp;
            </span>
          </div>
          {(
            <QueryValue
              // TODO: Path using path.
              actions={actions}
              localAppRegistry={localAppRegistry}
              path={`${field}`}
              onChangeQueryItemValue={(newValue) => onChangeQueryItemValue(field, newValue)}
              value={value}
              // originalValue={originalValue}
              schemaFields={schemaFields}
              schema={schema}
              fieldName={field}
              schemaLoaded={schemaLoaded}
              store={store}
              // bsonType={bsonType}
            />
          )}
          {!isBSONValue && Array.isArray(value) && this.renderArray()}
          {!isBSONValue && isObject(value) && !Array.isArray(value) && (
            <Fragment>
              &nbsp;&#123;
              <div
                className={styles['query-object']}
              >
                {Object.entries(value).map(
                  ([nestedField, nestedValue], index) => (
                    <QueryItem
                      // key={`${field}-${index}`}
                      actions={actions}
                      localAppRegistry={localAppRegistry}
                      path={`${field}.${nestedField}`}
                      field={nestedField}
                      schema={schema}
                      schemaLoaded={schemaLoaded}
                      value={nestedValue}
                      // queryItem={query}
                      onChangeQueryItemValue={this.onChangeQueryItemValue}
                      onRemoveQueryItem={this.onRemoveQueryItem}
                      onRenameQueryItem={this.onRenameQueryItem}
                      onAddQueryItem={this.onAddQueryItem}
                      renameAndUpdateValue={this.renameAndUpdateValue}
                      schemaFields={schemaFields}
                      store={store}
                    />
                  )
                )}
                {Object.entries(value).length === 0 && (
                  <div
                    // className={styles['query-object']}
                  >
                    <button
                      onClick={() => this.onAddQueryItem()}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              &#125;
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default QueryItem;
