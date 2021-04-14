import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';

import UniqueMiniChart from '../unique-minichart';
import DocumentMinichart from '../document-minichart';
import ArrayMinichart from '../array-minichart';
import CoordinatesMinichart from '../coordinates-minichart';
import D3Component from '../d3-component';
import vizFns from 'modules';
import CONSTANTS from 'constants/schema';

class MiniChart extends Component {
  static displayName = 'MiniChartComponent';

  static propTypes = {
    localAppRegistry: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    nestedDocType: PropTypes.object,
    store: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      containerWidth: null,
      filter: {},
      valid: true,
      userTyping: false
    };
    this.resizeListener = this.handleResize.bind(this);
  }

  componentDidMount() {
    // yes, this is not ideal, we are rendering the empty container first to
    // measure the size, then render the component with content a second time,
    // but it is not noticable to the user.
    this.resizeListener();
    window.addEventListener('resize', this.resizeListener);

    if (this.props.store) {
      console.log('store', this.props.store);
      const onQueryChanged = (store) => {
        this.setState({
          filter: store.filter,
          valid: store.valid,
          userTyping: store.userTyping
        });
      };

      // Also populate initial values
      // if (QueryStore.state) {}
      onQueryChanged(this.props.store.state);

      this.unsubscribeQueryStore = this.props.store.listen(onQueryChanged);
      // this.unsubscribeMiniChartResize = this.props.actions.resizeMiniCharts.listen(this.resizeListener);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.valid && !nextState.userTyping;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
    if (this.unsubscribeQueryStore) {
      this.unsubscribeQueryStore();
      // this.unsubscribeMiniChartResize();
    }
  }

  /**
   * Called when the window size changes or via the resizeMiniCharts action,
   * triggered by index.jsx. Only redraw if the size is > 0.
   */
  handleResize() {
    const rect = this._mc.getBoundingClientRect();
    if (rect.width > 0) {
      this.setState({
        containerWidth: rect.width
      });
    }
  }

  minichartFactory() {
    // cast all numeric types to Number pseudo-type
    // when drawing charts, group all the types of dates together
    const typeName = includes([ CONSTANTS.DECIMAL_128, CONSTANTS.DOUBLE, CONSTANTS.INT_32, CONSTANTS.LONG ], this.props.type.name)
      ? CONSTANTS.NUMBER : includes([ CONSTANTS.UTCDATETIME, CONSTANTS.TIMESTAMP ], this.props.type.name)
        ? CONSTANTS.DATE : this.props.type.name;

    const fieldName = this.props.fieldName;
    const queryValue = this.state.filter[fieldName];
    const hasDuplicates = this.props.type.has_duplicates;
    const fn = vizFns[typeName.toLowerCase()];
    const width = this.state.containerWidth;

    // console.log('fieldNamefieldNamefieldName', fieldName);

    if (includes([ CONSTANTS.STRING, CONSTANTS.NUMBER ], typeName) && !hasDuplicates) {
      // console.log('minichart');
      return (
        <UniqueMiniChart
          localAppRegistry={this.props.localAppRegistry}
          key={typeName}
          fieldName={fieldName}
          queryValue={queryValue}
          type={this.props.type}
          width={width}
        />
      );
    }
    if (typeName === 'Coordinates') {
      const height = width / 1.618; // = golden ratio
      return (
        <CoordinatesMinichart
          actions={this.props.actions}
          fieldName={fieldName}
          type={this.props.type}
          width={width}
          height={height}
          localAppRegistry={this.props.localAppRegistry}
        />
      );
    }
    if (typeName === 'Document') {
      return (
        <DocumentMinichart
          nestedDocType={this.props.nestedDocType}
        />
      );
    }
    if (typeName === 'Array') {
      return (
        <ArrayMinichart
          type={this.props.type}
          nestedDocType={this.props.nestedDocType}
        />
      );
    }
    if (typeName === 'Null') {
      return <div>Null</div>;
    }
    if (!fn) {
      // console.log('vizFns', vizFns);
      // console.log(Object.keys(vizFns));
      // console.log('typename', typeName);
      // console.log('no fn!');
      return null;
    }
    return (
      <D3Component
        fieldName={this.props.fieldName}
        type={this.props.type}
        renderMode="svg"
        query={queryValue}
        width={width}
        height={100}
        fn={fn}
        localAppRegistry={this.props.localAppRegistry}
      />
    );
  }

  render() {
    const minichart = this.state.containerWidth ? this.minichartFactory() : null;
    return (
      <div ref={(chart) => { this._mc = chart; }}>
        {minichart}
      </div>
    );
  }
}

export default MiniChart;
