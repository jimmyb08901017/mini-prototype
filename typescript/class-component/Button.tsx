'use client'
import React from 'react';

/**
 * [Note]
 * If you are using state, then this is a client component. Remember to add 'use client'.
 * 
 * [Reference]
 * https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components
 * https://react.dev/reference/react/Component
 * 
 */

// Props pass to the class component
type MyProps = {
  // using `interface` is also ok
  message: string;
};

// State variables pass to the class component
type MyState = {
  count: number; // like this
};

class Button extends React.Component<MyProps, MyState> {
  state: MyState = {
    // optional second annotation for better type inference
    count: 0,
  };
  pointer: number = 3; // Class properties

  // In modern JS syntax, constructors are rarely needed.
  // See https://react.dev/reference/react/Component#constructor
  // constructor(props: MyProps) {
  //   super(props);
  //   this.pointer = 3;
  // }

  render() {
    return (
      <div onClick={() => this.increment(1)} className="ring-2 ring-black">
        {this.props.message} {this.state.count}
        <div>pointer: {this.pointer}</div>
      </div>
    );
  }

  ///// Three methods that should be used together:
  componentDidMount() {
    // triggered once after mount.
    this.pointer = 5;
  }

  componentDidUpdate(prevProps, prevState) { // triggered when props/states have changed
    // Update props or states
    console.log(this.state.count)
  }

  componentWillUnmount(): void { // triggered when unmount.
    // Should clean up everything done in componentDidmount().
    this.pointer = 0;      
  }
  ////

  shouldComponentUpdate(nextProps: Readonly<MyProps>, nextState: Readonly<MyState>, nextContext: any): boolean {
    // If return true, component will update(re-render).
    if(this.pointer > this.state.count) { // pointer can add up to over 5, but no re-render.
      return true;
    }
    return false;
  }

  // Self-defined class function
  increment = (amt: number) => {
    // like this
    this.setState((state)=>({
      count: state.count + amt,
    }))
  }
}

export { Button };
  