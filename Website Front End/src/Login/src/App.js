import React from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import "./App.scss";
import Login, {login} from "./components/login/login";
import Register from "./components/login/register";
import Navbar from "./components/Navbar";
import "./components/Navbar.css";
import { FooterContainer } from './containers/footer';

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
      loginPage: true
    };
  }

  componentDidMount() {
    //Add .right by default
    this.rightSide.classList.add("right");
  }

  changeState() {
    const { isLogginActive } = this.state;

    if (isLogginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";
    return (
      <div>
        <Router>
          <div >
            <Navbar/>
          </div>

          <div className="login App tc" style={{margin: "auto"}}>
            <div className="container" ref={ref => (this.container = ref)}>
            {isLogginActive && (
              <Login containerRef={ref => (this.current = ref)} />
            )}
            {!isLogginActive && (
              <Register containerRef={ref => (this.current = ref)} />
            )}
            </div>
            <RightSide
            current={current}
            currentActive={currentActive}
            containerRef={ref => (this.rightSide = ref)}
            onClick={this.changeState.bind(this)}
            />
          </div>

          <div style={{marginTop:"12%"}}>
            <FooterContainer/>
          </div>
        </Router>
      </div>
    );
  }
}

const RightSide = props => {
  return (
    <div
    className="right-side"
    ref={props.containerRef}
    onClick={props.onClick}
    >
    <div className="inner-container">
    <div className="text">{props.current}</div>
    </div>
    </div>
  );
};

export default App;
