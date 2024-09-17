import { Component } from 'react';
import './App.css';
import Logo from '../components/Logo/Logo';
import Navigation from '../components/Navigation/Navigation';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import ParticlesComponent from '../components/Particles/Particles';

class App extends Component {
  render(){
    return(
      <div className='App'>
        <ParticlesComponent id = "particles"/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/*<FaceRecognition/>*/}
      </div>
    );
  }
}
export default App;
