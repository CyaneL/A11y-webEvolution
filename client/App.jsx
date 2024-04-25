import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import './style.css'
import Header from './src/components/Header';
import Form from './src/components/Form';
// import ChartDisplay from './src/components/ChartDisplay';

const App = () => {
  return(
    <div className="App">
    <Header />
    <Form />
    </div>
  )
}

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App />);
export default App;