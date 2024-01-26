"use client";
import React from "react";

/**
 * [Note]
 * If you are using state, then this is a client component. Remember to add 'use client'.
 *
 * [Reference]
 * https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components
 * https://react.dev/reference/react/Component
 *
 */
type MyStatus = "loading" | "connected" | "disconnected";

function createConnection(roomId: string, serverUrl: string) {
  return {
    connect() {
      console.log("Connected to " + roomId + " at " + serverUrl + "!");
      return true;
    },
    disconnect() {
      console.log("Disconnected to " + roomId + " at " + serverUrl + "!");
      return true;
    },
  };
}

// Props pass to the class component
type MyProps = {
  // using `interface` is also ok
  roomId: string;
};

// State variables pass to the class component
type MyState = {
  status: MyStatus;
  serverUrl: string;
};

class Button extends React.Component<MyProps, MyState> {
  state: MyState = {
    status: "disconnected",
    serverUrl: "https://localhost:1234",
  };
  connection: ReturnType<typeof createConnection> | null = null;

  render() {
    return (
      <div onClick={this.handleClick} className="ring-2 ring-black">
        {this.state.status}
      </div>
    );
  }

  ///// Three methods that should be used together:
  componentDidMount() {
    // triggered once after mount.
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    // triggered when props/states have changed
    // Update props or states
  }

  componentWillUnmount(): void {
    // triggered when unmount.
    // Should clean up everything done in componentDidmount().
    this.destroyConnection();
  }
  ////

  shouldComponentUpdate(
    nextProps: Readonly<MyProps>,
    nextState: Readonly<MyState>,
    nextContext: any,
  ): boolean {
    // If return true, component will update(re-render).
    if (nextState.status !== this.state.status) {
      return true;
    }
    return false;
  }

  // Self-defined class function
  setupConnection = () => {
    this.connection = createConnection(this.props.roomId, this.state.status);
    this.setState(() => ({ status: "loading" }));
    this.connection.connect();
    this.setState(() => ({ status: "connected" }));
  };

  destroyConnection = () => {
    this.setState(() => ({ status: "loading" }));
    this.connection?.disconnect();
    this.connection = null;
    this.setState(() => ({ status: "disconnected" }));
  };

  handleClick = () => {
    if (this.state.status === "connected") {
      this.destroyConnection();
    } else if (this.state.status === "disconnected") {
      this.setupConnection();
    }
  };
}

export { Button };
