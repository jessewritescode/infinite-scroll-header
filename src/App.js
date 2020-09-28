import React, { Fragment, PureComponent } from "react";
import { name } from "faker";
import Consumer from "./Consumer";

const ITEM_COUNT = 100;

class App extends PureComponent {
  state = {
    hasNextPage: true,
    isNextPageLoading: false,
    items: []
  };

  _loadNextPage = (...args) => {
    console.log("loadNextPage", ...args);
    this.setState({ isNextPageLoading: true }, () => {
      setTimeout(() => {
        this.setState(state => ({
          hasNextPage: state.items.length < ITEM_COUNT,
          isNextPageLoading: false,
          items: [...state.items].concat(
            new Array(15).fill(true).map(() => ({ name: name.findName() }))
          )
        }));
      }, 500);
    });
  };

  render() {
    const { hasNextPage, isNextPageLoading, items } = this.state;

    return (
      <Fragment>
        <Consumer
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          items={items}
          itemCount={ITEM_COUNT}
          loadNextPage={this._loadNextPage}
        />

        <p className="Note">
          Infinite loading + header + sticky
        </p>
      </Fragment>
    );
  }
}

export default App;
