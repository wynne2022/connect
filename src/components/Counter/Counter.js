import React from "react";
import {increment, store} from "../redux/redux";
// import { connect } from 'react-redux'
import { ReactReduxContext } from 'react-redux';

//parent, state, props, forceUpdate
class Counter extends React.Component {
  constructor() {
    super();
  }


  // state = {
  //   counter: 0,
  // };

  handleClick = () => {
   this.props.increment()
  };
  render() {
    const {counter} = this.props
    return (
      <>
        <p>{counter}</p>
        <button onClick={this.handleClick}>increment counter</button>
      </>
    );
  }
}
/* 
  mapStateToProps,  read state from redux
  mapDispatchToProps
*/

const mapStateToProps = (state) => {
  const {counter} = state
  return {
    counter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => {dispatch(increment)}
  }
}

// const defaultMapStateToProps = (state) => ({});
// const defaultMapDispatchToProps = (dispatch) => ({});
const connect = (mapStateToProps=(state) => ({}), mapDispatchToProps=(dispatch) => ({}), mergeProps, options) =>(WrappedComponent) => {
  return class ConnectedComponent extends React.Component {
    static contextType = ReactReduxContext;

    componentDidMount() {
      const { store } = this.context;
      this.unsubscribe = store.subscribe(this.handleStoreUpdate);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    handleStoreUpdate = () => {
      this.forceUpdate();
    };

    render() {
      const { store } = this.context;
      const stateProps = mapStateToProps(store.getState());
      const dispatchProps = mapDispatchToProps(store.dispatch);
      const mergedProps = mergeProps
        ? mergeProps(stateProps, dispatchProps, this.props)
        : { ...stateProps, ...dispatchProps };

      return <WrappedComponent {...mergedProps} />;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
