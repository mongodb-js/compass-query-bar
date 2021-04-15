import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EJSON } from 'bson';
import parseSchema from 'mongodb-schema';
import util from 'util';
import queryParser from 'mongodb-query-parser';

import styles from './query.less';

import QueryItem from './query-item/query-item';

function parseQueryFromStore(value) {
  let query = {};
  try {
    // console.log('value', value);
    query = (value && value !== '')
      ? EJSON.parse(value, { relaxed: false })
      : {'': ''};
    // console.log('query', query);
  } catch (err) {
    // console.log('existing', value);
    // console.log('unable to parse existing query:', err);
    try {
      query = queryParser.parseFilter(value);

      // console.log('early parsed q', query);
      // query = EJSON.stringify(query);
      // console.log('stringified q', query);

      // query = EJSON.parse(query, { relaxed: false });
      // console.log('parsed q', query);
      // query = value;
      //
    } catch (e) {
      console.log('unable to parse filter either, defaulting...');
      //
    }
  }
  query = EJSON.stringify(query);
  query = JSON.parse(query);

  // console.log('resulting q', query);
  return query;
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

class Query extends Component {
  static displayName = 'Query';

  static propTypes = {
    // actions: PropTypes.object.isRequired,
    localAppRegistry: PropTypes.object.isRequired,
    // label: PropTypes.string.isRequired,
    serverVersion: PropTypes.string.isRequired,
    // autoPopulated: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onApply: PropTypes.func,
    ns: PropTypes.string,
    placeholder: PropTypes.string,
    schemaFields: PropTypes.array,
    store: PropTypes.object
  };

  static defaultProps = {
    label: '',
    value: '',
    serverVersion: '3.6.0',
    // autoPopulated: false,
    schemaFields: []
  };

  // mounted = false;

  // state = {
  //   query: {
  //     'field': 'value'
  //   }
  // };

  /**
   * Set up the autocompleters once on initialization.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);

    const {
      value
    } = this.props;

    this.state = {
      query: parseQueryFromStore(value),
      schemaLoaded: false,
      schema: {}
    };

    // const textCompleter = tools.textCompleter;
    // this.completer = new QueryAutoCompleter(props.serverVersion, textCompleter, props.schemaFields);
    // this.boundOnFieldsChanged = this.onFieldsChanged.bind(this);
  }

  /**
   * Subscribe on mount.
   */
  componentDidMount() {
    this.mounted = true;
    this.loadSchema();

    // this.unsub = this.props.actions.refreshEditor.listen(() => {
    //   this.editor.setValue(this.props.value);
    //   this.editor.clearSelection();
    // });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ns !== this.props.ns) {
      this.loadSchema();
    }
  }

  loadSchema = async() => {
    if (!this.mounted) {
      return;
    }

    this.setState({
      schemaLoaded: false
    });

    if (global.hackDS) {
      await this.loadSchemaWithDataService(global.hackDS);
    } else if (
      global.hadronApp
      && global.hadronApp.appRegistry
      && global.hadronApp.appRegistry.stores
      && global.hadronApp.appRegistry.stores['Connect.Store']
      && global.hadronApp.appRegistry.stores['Connect.Store'].dataService
    ) {
      await this.loadSchemaWithDataService(global.hadronApp.appRegistry.stores['Connect.Store'].dataService);
    } else {
      console.log('no ds, pollling...');
      // Hacky polling with no cleanup :)
      setTimeout(() => {
        this.loadSchema();
      }, 200);
    }
  }

  loadSchemaWithDataService = async(dataService) => {
    const {
      ns
    } = this.props;

    console.log('load schema for ns', ns);

    const runFind = util.promisify(dataService.find.bind(dataService));
    try {
      const documents = await runFind(ns, {}, {});

      const runParseSchema = util.promisify(parseSchema);
      const schema = await runParseSchema(documents);

      console.log('schema loaded', schema);

      this.setState({
        schemaLoaded: true,
        schema
      });
    } catch (e) {
      console.log('failed to fetch or parse schema of documents:', e);
    }
  }

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
    console.log('query object before stringing', queryObj);
    let newCode = '';
    try {
      // console.log('serialized:', EJSON.serialize(queryObj));
      newCode = EJSON.stringify(queryObj);
      console.log('after stringing', newCode);
      // newCode = queryParser.stringify(queryObj);
      // console.log('stringified ejson')
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
    console.log('onChangeQueryItemValue', index, newValue);
    const newQuery = {
      ...this.state.query,
      [index]: newValue
    };
    console.log('new q after that', newQuery);

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
    let newFieldName = '';
    if (this.state.query[newFieldName]) {
      let counter = 1;
      while (!!this.state.query[`field ${counter}`]) {
        counter++;
      }
      newFieldName = `field ${counter}`;
    }

    const newQuery = {
      ...this.state.query,
      [newFieldName]: ''
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
      schema,
      schemaLoaded
    } = this.state;

    const {
      actions,
      localAppRegistry,
      schemaFields,
      store,
      value
    } = this.props;

    const query = parseQueryFromStore(value);

    return (
      <div
        className={styles.query}
      >
        {Object.entries(query).map(
          ([field, fieldValue], index) => (
            <QueryItem
              actions={actions}
              localAppRegistry={localAppRegistry}
              key={`${index}`}
              path={field}
              field={field}
              // bsonType={bsonDoc._bsontype ? bsonDoc._bsontype : null}
              value={fieldValue}
              // queryItem={query}
              schema={schema}
              schemaLoaded={schemaLoaded}
              schemaFields={schemaFields}
              store={store}
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
