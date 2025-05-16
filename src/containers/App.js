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
  imageUrl: "",
  boxes: [],
  route: 'Signin',
  isSignedIn: false,
  error: null,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState 
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.created_at
      },
      imageUrl: "",
      input: "",
      boxes: []
    })
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  }

  calculateFaceLocations = (response) => {
    if (!response || !response.outputs || !response.outputs[0] || !response.outputs[0].data) {
      throw new Error('Invalid response format from API');
    }

    const image = document.getElementById("inputimage");
    if (!image) {
      throw new Error('Image element not found');
    }

    const width = Number(image.width);
    const height = Number(image.height);

    // Process all regions/faces
    return response.outputs[0].data.regions.map(region => {
      const face = region.region_info.bounding_box;
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      };
    });
  }

  onInputChange =(event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input, error: null});
    fetch(`${process.env.REACT_APP_API_URL}/imageurl`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      return response.json();
    })
    .then(response => {
      if (response && response.outputs) {
        fetch(`${process.env.REACT_APP_API_URL}/image`, {
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
        .catch(err => {
          console.error("Unable to update entries:", err);
          this.setState({ error: "Failed to update entry count" });
        });

        try {
          const boxes = this.calculateFaceLocations(response);
          this.displayFaceBoxes(boxes);
        } catch (error) {
          console.error("Error calculating face locations:", error);
          this.setState({ error: "No faces detected in the image" });
        }
      } else {
        this.setState({ error: "Invalid response from face detection service" });
      }
    })
    .catch(err => {
      console.error("Error processing image:", err);
      this.setState({ error: "Failed to process image. Please try again." });
    });
  }

  onRouteChange = (route) => {
    if(route === 'Signout'){
      this.setState(initialState);
      route = 'Signin';  // Redirect to signin page after signout
    } else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render(){
    const {imageUrl, boxes, route, isSignedIn, error } = this.state;
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
            {error && (
              <div className="center">
                <p className="dark-red f3">{error}</p>
              </div>
            )}
            <FaceRecognition boxes={boxes} imageUrl = {imageUrl}/>
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
