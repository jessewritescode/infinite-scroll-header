
import React from 'react';
import List from './List';
import InfiniteLoader from 'react-window-infinite-loader';

// Our header size.  I reckon we can make this implied by using useLayoutEffect
const PADDING_SIZE = 100;

export default function ExampleWrapper({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
  itemCount,
}) {
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = index => !hasNextPage || index < items.length;


  // Our item render. Things to note here are:
  // 1. IsLoaded status is handled here
  // 2. PADDING_SIZE is added to accommodate the header
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = items[index].name;
    }

    return (<div
      className={index % 2 === 0 ? 'RowEven' : 'RowOdd'}
      style={{
        ...style,
        top: `${parseFloat(style.top) + PADDING_SIZE}px`
      }}
    >
      {content}
    </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={450}
          itemCount={itemCount}
          itemSize={30}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={600}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
