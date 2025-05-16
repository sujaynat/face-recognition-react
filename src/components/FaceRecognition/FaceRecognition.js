import React from "react";
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, boxes}) => {
    return (
        <div className="center">
            <div className="face-recognition-container">
                {imageUrl && (
                    <>
                        <img 
                            id="inputimage"
                            alt="Face Detection"
                            src={imageUrl}
                            className="face-recognition-image"
                            onError={(e) => {
                                console.error('Image failed to load:', imageUrl);
                                e.target.style.display = 'none';
                            }}
                        />
                        {boxes && boxes.length > 0 && boxes.map((box, i) => (
                            <div 
                                key={i}
                                className="bounding-box" 
                                style={{
                                    top: box.topRow,
                                    right: box.rightCol,
                                    bottom: box.bottomRow,
                                    left: box.leftCol
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default FaceRecognition;