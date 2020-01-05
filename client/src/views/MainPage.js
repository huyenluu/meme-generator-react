import React from 'react';
import TextPropsPicker from '../components/TextPropsPicker';
import SideBar from '../components/SideBar';
import MainContent from '../components/MainContent';

const initialState = {
  toptext: "",
  bottomtext: "",
  isTopDragging: false,
  isBottomDragging: false,
  topY: "10%",
  topX: "50%",
  bottomX: "50%",
  bottomY: "90%",
  textStyle: {
    fontFamily: "Impact",
    fontSize: '54px',
    textTransform: "uppercase",
    fill: "#FFF",
    stroke: "#000",
    userSelect: "none"
  }, 
  fontFamily: 'Impact'
}

class Main extends React.Component {
  constructor(props) {
    super();
    this.state = {
      currentImage: props.imageSrc,
      isOpen: false,
      currentImagebase64: null,
      ...initialState
    };
  }

  openImage = () => {
    const base_image = new Image();
    base_image.src = this.state.currentImage;
    const base64 = this.getBase64Image(base_image);
     this.setState({
        isOpen: true,
        currentImagebase64: base64,
      ...initialState
    });
  }

  changeText = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  getStateObj = (e, type) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;
    let stateObj = {};
    if (type === "bottom") {
      stateObj = {
        isBottomDragging: true,
        isTopDragging: false,
        bottomX: `${xOffset}px`,
        bottomY: `${yOffset}px`
      }
    } else if (type === "top") {
      stateObj = {
        isTopDragging: true,
        isBottomDragging: false,
        topX: `${xOffset}px`,
        topY: `${yOffset}px`
      }
    }
    return stateObj;
  }

  handleMouseDown = (e, type) => {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
    this.setState({
      ...stateObj
    })
  }

  handleMouseMove = (e, type) => {
    if (this.state.isTopDragging || this.state.isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && this.state.isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && this.state.isTopDragging){
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj
      });
    }
  };

  handleMouseUp = (event) => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({
      isTopDragging: false,
      isBottomDragging: false
    });
  }

  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }


  updateFont = (e) => {
     this.setState({
        textStyle: {
            ...this.state.textStyle,
            fontFamily: e.target.value,
        }
    })
  }

  updateFontSize = async(e) => {
    await this.setState({
       textStyle: {
           ...this.state.textStyle,
           fontSize: `${e.target.value}px`,
       }
   })
 }
  updateColor = (color) => {
      this.setState({
          textStyle: {
              ...this.state.textStyle,
              fill: color.hex,
          }
      })
  }

  render() {
    const base_image = new Image();
    base_image.src = this.state.currentImage;
    var wrh = base_image.width / base_image.height;
    var newWidth = 600;
    var newHeight = newWidth / wrh;

    return (
    <div className = 'container-fluid'>
      <div className='row'>
      <SideBar>
          <nav className="navbar">
            <a className="navbar-brand" href="/">Meme Generator</a>
          </nav>
          <div>
            <TextPropsPicker
              changeText = {this.changeText}
              updateFont= {this.updateFont}
              updateFontSize ={this.updateFontSize}
              updateColor = {this.updateColor}
              textStyle={this.state.textStyle}
            />
            <button 
                onClick={() => this.convertSvgToImage()} 
                className="btn btn-primary download-btn"
            >
                Download Meme!
            </button>
          </div>
        </SideBar>
      <MainContent>
          <div className="image-holder" style ={{display: 'none'}}>
              <img
              alt=''
              src={this.state.currentImage}
              onLoad={() => this.openImage()}
              />
            </div>

            {this.state.isOpen && 
            (<div>
                <svg
                width={newWidth}
                id="svg_ref"
                height={newHeight}
                ref={el => { this.svgRef = el }}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="image-holder"
                >
                <image
                    ref={el => { this.imageRef = el }}
                    xlinkHref={this.state.currentImagebase64}
                    height={newHeight}
                    width={newWidth}
                />
                <text
                    style={{ ...this.state.textStyle, zIndex: this.state.isTopDragging ? 4 : 1 }}
                    x={this.state.topX}
                    y={this.state.topY}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    onMouseDown={event => this.handleMouseDown(event, 'top')}
                    onMouseUp={event => this.handleMouseUp(event, 'top')}
                >
                    {this.state.toptext}
                </text>
                <text
                    style={this.state.textStyle}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    x={this.state.bottomX}
                    y={this.state.bottomY}
                    onMouseDown={event => this.handleMouseDown(event, 'bottom')}
                    onMouseUp={event => this.handleMouseUp(event, 'bottom')}
                >
                    {this.state.bottomtext}
                </text>
                </svg>
            </div>
            )}
            <p style ={{color: '#666666'}}>Drag text to move</p>
        </MainContent>
        
      </div>
        
    </div>
    )
  }
}

export default Main;

