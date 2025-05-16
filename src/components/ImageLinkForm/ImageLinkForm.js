import React from "react";

import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    const sampleImageUrl = 'https://samples.clarifai.com/face-det.jpg';

    return(
        <div className="ma3 mt0">
            <p className="f3 mb3">
                {'This Magic Brain will detect faces in your pictures. Give it a try!'}
            </p>
            <div className="center form-container">
                <div className="form center pa3 br3 shadow-5">
                    <input 
                        className='f4 pa2 w-70 center' 
                        type="text" 
                        placeholder="Paste your image URL here"
                        onChange={onInputChange}
                    />
                    <button 
                        className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple" 
                        onClick={onButtonSubmit}
                    >
                        Detect
                    </button>
                </div>
            </div>
            <div className="center mt3">
                <div className="helper-text white-90">
                    <p className="mb1">
                        {'Please enter a direct image URL (must end in .jpg, .jpeg, .png, etc.)'}
                    </p>
                    <p>
                        {'Try this sample: '} 
                        <span 
                            className="link bright-blue pointer" 
                            onClick={() => {
                                document.querySelector('input').value = sampleImageUrl;
                                onInputChange({ target: { value: sampleImageUrl } });
                            }}
                        >
                            {sampleImageUrl}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;