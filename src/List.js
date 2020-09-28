import React, { createContext, forwardRef, useRef, useContext, useState, useCallback, useEffect } from "react";
import "./index.css";
import { FixedSizeList} from "react-window";

const PADDING_SIZE = 100;
const STICKY_SIZE = 35;

const ListContext = createContext();

const ListContextProvider = ({itemRenderer, ...props}) => {
  const [isInStickyMode, setIsInStickyMode] = useState(false);

  return (
  <ListContext.Provider value={{isInStickyMode, setIsInStickyMode, itemRenderer}}>
    {props.children}
  </ListContext.Provider>);
};


const ItemWrapper = ({ data, index, style }) => {
  const { ItemRenderer} = data;
  return <ItemRenderer index={index} style={style} />;
};


// This is where the sticky row is being used.  We are passing the sticky
// value in via context, because I was going to manual fix it to the top when
// we are in "sticky mode" (scrolled past the sticky height). probably not needed
// now--I'm just using position: sticky in css, but if we couldnt use that, we would
// default to this.
const innerElementType = forwardRef(({ children, ...rest }, ref) => {
  return (
    <ListContext.Consumer>
      {({ isInStickyMode }) => (
        <div ref={ref} {...rest}>
          <Header isStickyMode={isInStickyMode} />
          {children}
        </div>
      )}
    </ListContext.Consumer>
  );
});


const StickyList = ({ children, stickyIndices, ...rest }) => {
  const ref = useRef(null);

  console.log(ref.current && ref.current.scrollTop)

  return (
    <ListContextProvider itemRenderer={children}>
      <>
      <FixedSizeList
        ref={ref}
        itemData={{ ItemRenderer: children}}
        innerElementType={innerElementType}
        outerElementType={outerElementType}
        {...rest}>
         {ItemWrapper}
      </FixedSizeList>
      </>
    </ListContextProvider>
  );
};

// This would be moved out of here and provided as a render function to
// the list. Perhaps even as children().
const Header = (props) => {
  if (props.isStickyMode) {
    return (
      <div className="sticky">I am your header row</div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: '0' }}>
      <h1>Tote's data</h1>
      <div className="sticky">I am your header row</div>
    </div>
  )
}


// This is probably not needed, but I use this function to get the
// current scroll position toggle "sticky mode" in the list context.
const outerElementType = forwardRef((props, ref) => {
  const [currentScroll, setCurrentScroll] = useState(0);
  const context = useContext(ListContext);

  const switchToStickyWhen = PADDING_SIZE - STICKY_SIZE;

  useEffect(() => {
    const isStickyMode = switchToStickyWhen < currentScroll;
    context.setIsInStickyMode(isStickyMode);
  }, [switchToStickyWhen, currentScroll, context]);


  const interceptOnScroll = useCallback((...args) => {
    setCurrentScroll(args[0].target.scrollTop);
    props.onScroll(...args);
  }, [props, setCurrentScroll]);

  return (
    <div ref={ref} {...props} onScroll={interceptOnScroll}>
      {props.children}
    </div>
  );
});


export default StickyList;
