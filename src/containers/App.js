import { Component } from 'react';
import './App.css';
import Logo from '../components/Logo/Logo';
import Navigation from '../components/Navigation/Navigation';
import Signin from '../components/Signin/Signin';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import ParticlesComponent from '../components/Particles/Particles';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Register from '../components/Register/Register';

const initialState = {
  input: "",
  imageUrl:"",
  box: {},
  route:'Signin',
  isSignedIn: false,
  user:{
    id: "",
    name: "",
    email:"",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState 
  }

  loadUser = (data) =>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined
    }

    })
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
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(err=> console.log("Unable to fetch image"))

      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'Signout'){
      this.setState(initialState);
    }else if(route==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route:route})
  }

  render(){
    const {imageUrl, box, route,isSignedIn } = this.state;
    return(
      <div className='App'>
        <ParticlesComponent className = "particles"/>
        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>
        { route==='home'
          ?<div>
            <Logo />
            <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
            <ImageLinkForm
                    onInputChange= {this.onInputChange}
                    onButtonSubmit= {this.onButtonSubmit}
                  />
            <FaceRecognition box={box} imageUrl = {imageUrl}/>
        </div>     
        :(
          route==='Signin'?   
            <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
           
      </div>
    );
  }
}
export default App;
