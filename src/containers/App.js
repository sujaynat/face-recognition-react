import { Component } from 'react';
import './App.css';
import Logo from '../components/Logo/Logo';
import Navigation from '../components/Navigation/Navigation';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import ParticlesComponent from '../components/Particles/Particles';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';



class App extends Component {
  constructor(){
    super();
    this.state = {
      input: "",
      imageUrl:"",
      box: {}
    }
  }

  displayFaceBox=(box) =>{
    this.setState({box:box});
  }

  calculateFaceLocation = (response) =>{
    const face = response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    const faceBox ={
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
    return faceBox;

  }
  onInputChange =(event) => {
    this.setState({input: event.target.value})
    console.log({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response=> response.json())
    .then(response => {
      console.log('hi', response)
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  

  render(){
    const {imageUrl, box } = this.state;
    return(
      <div className='App'>
        <ParticlesComponent className = "particles"/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
        <FaceRecognition box={box} imageUrl = {imageUrl}/>
      </div>
    );
  }
}
export default App;
